import { Balance, Debt } from "./balance.models";
import { DebtType, debtSchema } from "./balance.zodSchema";
import { User } from "../user/user.models";
import { ClientSession } from "mongoose";
import { Group } from "../group/group.models";

const addToBalance = async (data: DebtType, session: ClientSession) => {
  const { paidBy, paidTo, amount, debtType, group } = data;

  try {
    const parsedDebt = await debtSchema.parseAsync({
      paidBy,
      paidTo,
      amount,
      debtType,
      group,
    });

    if (paidBy === paidTo) {
      const paidByUser = await User.findById(paidBy);

      const paidByBalanceDetails = await Balance.findOne({
        user: paidByUser,
        group: group,
        balanceType: debtType,
      }).session(session);

      if (!paidByBalanceDetails) {
        
        const bal = new Balance({
          user: paidByUser,
          group: group,
          balanceType: debtType,
        });
        
        await bal.save({ session });
      }

      const paidByUpdateDetails = {
        $inc: { totalShare: parseFloat(amount.toFixed(2)) },
      };
      const updatedBalPaidBy = await Balance.findOneAndUpdate(
        { user: paidByUser, group: group, balanceType: debtType },
        paidByUpdateDetails,
        { new: true, session: session }
      );
      return;
    }

    const debt = await Debt.findOne({
      $or: [
        { $and: [{ paidBy }, { paidTo }] },
        { $and: [{ paidBy: paidTo }, { paidTo: paidBy }] },
      ],
      group: group,
      debtType: debtType,
    }).session(session);

    if (!debt) {
      const newDebt = new Debt(parsedDebt);
      await newDebt.save({ session });
    } else {
      if (paidBy != debt.paidBy) {
        const debtDiff = debt.amount - amount;
        if (debtDiff <= 0) {
          await Debt.findByIdAndDelete(debt._id, { session });
          if (debtDiff < 0) {
            const newDebt = new Debt({
              debtType: parsedDebt.debtType,
              amount: Math.abs(parseFloat(debtDiff.toFixed(2))),
              paidBy: parsedDebt.paidBy,
              paidTo: parsedDebt.paidTo,
              group: group,
              balanceType: debtType,
            });
            await newDebt.save({ session });
          }
        } else {
          await Debt.findByIdAndUpdate(
            debt._id,
            { $inc: { amount: -parseFloat(amount.toFixed(2)) } },
            { session }
          );
        }
      } else {
        await Debt.findByIdAndUpdate(
          debt._id,
          { $inc: { amount: parseFloat(amount.toFixed(2)) } },
          { session }
        );
      }
    }
    const paidByUser = await User.findById(paidBy);

    const paidByBalanceDetails = await Balance.findOne({
      user: paidByUser,
      group: group,
      balanceType: debtType,
    }).session(session);

    if (!paidByBalanceDetails) {
      const bal = new Balance({
        user: paidByUser,
        group: group,
        balanceType: debtType,
      });
      await bal.save({ session });
    }

    const paidByUpdateDetails = {
      $inc: {
        totalBalance: parseFloat(amount.toFixed(2)),
        totalPaidFor: parseFloat(amount.toFixed(2)),
      },
    };
    const updatedBalPaidBy = await Balance.findOneAndUpdate(
      { user: paidByUser, group: group, balanceType: debtType },
      paidByUpdateDetails,
      { new: true, session: session }
    );

    const paidToUser = await User.findById(paidTo);

    const paidBToBalanceDetails = await Balance.findOne({
      user: paidToUser,
      group: group,
      balanceType: debtType,
    }).session(session);

    if (!paidBToBalanceDetails) {
      const bal = new Balance({
        user: paidToUser,
        group: group,
        balanceType: debtType,
      });
      await bal.save({ session });
    }

    const paidToUpdateDetails = {
      $inc: {
        totalBalance: -parseFloat(amount.toFixed(2)),
        totalShare: parseFloat(amount.toFixed(2)),
      },
    };

    const updatedBalPaidTo = await Balance.findOneAndUpdate(
      { user: paidToUser, group: group, balanceType: debtType },
      paidToUpdateDetails,
      { new: true, session: session }
    );
  } catch (err) {
    
    throw Error("Some Error is there!");
  }
};

export { addToBalance };
