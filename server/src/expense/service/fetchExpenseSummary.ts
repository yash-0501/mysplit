import { ObjectId, Schema, Types } from "mongoose";
import { ExpenseType } from "../expense.zodSchema";
import { User } from "../../user/user.models";

const getExpenseSummary = async (
  allExpenses: ExpenseType[],
  userId: Types.ObjectId
) => {
  let res: (ExpenseType & { yourShare: number })[] = [];
  for (const expense of allExpenses) {
    let userShare = 0;
    for (const participantData of expense.participants) {
      const participantUser = await User.findOne(participantData.participant);

      if (participantUser && participantUser._id.equals(userId)) {
        userShare = participantData.share;
      }
    }

    const resData: ExpenseType = {
      description: expense.description,
      amount: expense.amount,
      createdBy: expense.createdBy,
      createdAt: expense.createdAt,
      paidBy: expense.paidBy,
      participants: expense.participants,
      splitType: expense.splitType,
      expenseType: expense.expenseType,
      group: expense.group,
    };
    res.push({ ...resData, yourShare: userShare });
  }
  return res;
};

export { getExpenseSummary };
