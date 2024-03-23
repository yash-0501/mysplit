import { ObjectId, Schema, Types } from "mongoose";
import { Expense } from "../expense.models";
import { ExpenseType } from "../expense.zodSchema";
import { User } from "../../user/user.models";

const fetchGroupWiseExpenseSummary = async (
  groupId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const shareExpenses = await Expense.find({
    $and: [{ group: groupId }, { "participants.participant": userId }],
  })

  const expensesPaidFor = await Expense.find({
    $and: [{ group: groupId }, { "paidBy": userId }],
  })

  const now = new Date();

  const thisMonthExpenses = (expenses: ExpenseType[]) => { return expenses.filter((expense) => {
    const expenseDate = new Date(expense.createdAt);
    return (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    );
  });}

  const lastMonthExpenses = (expenses: ExpenseType[]) => { return expenses.filter((expense) => {
    const expenseDate = new Date(expense.createdAt);
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const lastYear =
      lastMonth === 11 ? now.getFullYear() - 1 : now.getFullYear();
    return (
      expenseDate.getMonth() === lastMonth &&
      expenseDate.getFullYear() === lastYear
    );
  });}

  const calculateShare = (filteredExpenses: ExpenseType[]) => {
    return filteredExpenses.reduce((totalShare, expense) => {
      const userShare =
        expense.participants.find(
          async (participant) =>{
            const participantUser = await User.findById(participant.participant);
            if(participantUser?._id == userId)
              return true;
            return false;
          }
        )?.share || 0;
      return totalShare + userShare;
    }, 0);
  };

  const shareThisMonth = calculateShare(thisMonthExpenses(shareExpenses));
  const shareLastMonth = calculateShare(lastMonthExpenses(shareExpenses));
  const totalShare = calculateShare(shareExpenses);

  const paidForThisMonth = calculateShare(thisMonthExpenses(expensesPaidFor));
  const paidForLastMonth = calculateShare(lastMonthExpenses(expensesPaidFor));
  const totalPaidFor = calculateShare(expensesPaidFor);





  return {
    yourShareThisMonth: shareThisMonth,
    yourShareLastMonth: shareLastMonth,
    yourTotalShare: totalShare,
    youPaidThisMonth: paidForThisMonth,
    youPaidLastMonth: paidForLastMonth,
    youTotalPaid: totalPaidFor
  };
};

export { fetchGroupWiseExpenseSummary };
