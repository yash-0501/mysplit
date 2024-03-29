import { MongooseError, startSession } from "mongoose";
import { Expense } from "./expense.models";
import { ExpenseType, expenseTypes } from "./expense.zodSchema";
import { User } from "../user/user.models";
import { addToBalance } from "../balance/balance.services";
import { Group } from "../group/group.models";

const createExpenseandUpdateBalance = async (expense: ExpenseType) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const newExpense = new Expense(expense);
    await newExpense.save({ session });
    const paidBy = expense.paidBy;
    const paidToData = expense.participants;

    for await (const pData of paidToData) {
      const paidTo = pData.participant;
      const participantUser = await User.findById(paidTo);
      if (!participantUser) throw new Error("Invalid User");
      const amount = pData.share;
      const group = newExpense.group;
      if (group) {
        const isValidGroup = await Group.findOne({
          $and: [{ members: paidBy }, { members: paidTo }, { _id: group }],
        }).session(session);

        if (!isValidGroup) throw new Error("Invalid Group Details");
      }
      if (newExpense) {
        await addToBalance(
          {
            paidBy: paidBy,
            paidTo: paidTo,
            amount: amount,
            debtType: newExpense.expenseType || expenseTypes.individual,
            group: newExpense.group,
          },
          session
        );
      } else {
        throw new Error("Error saving expense!");
      }
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      expense.group,
      {
        $inc: { totalExpense: expense.amount },
      },
      { new: true, session: session }
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.error("Error creating user and balance:", error);

    await session.abortTransaction(); // Rollback the transaction
    session.endSession();

    // Handle rollback failure if necessary
    throw error;
  }
};

export { createExpenseandUpdateBalance };
