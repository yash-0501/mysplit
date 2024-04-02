import { Schema } from "mongoose";
import { User } from "../user/user.models";
import { UserType } from "../user/user.zodSchema";
import { DebtType } from "./balance.zodSchema";

type debts = {
  to?: Schema.Types.ObjectId;
  from?: Schema.Types.ObjectId;
  debtType: String;
  amount: number;
  group?: Schema.Types.ObjectId;
};

const getDebts = async (debts: DebtType[], currUser: UserType) => {
  let owes: debts[] = [];
  let getBacks: debts[] = [];
  for (const debt of debts) {
    const user = await User.findOne(currUser);
    const paidByUser = await User.findOne(debt.paidBy);

    let data;

    if (paidByUser?.email == user?.email) {
      data = {
        from: debt.paidTo,
        debtType: "gets back",
        amount: debt.amount,
        group: debt.group,
      };
      getBacks.push(data);
    } else {
      data = {
        to: debt.paidBy,
        debtType: "owes",
        amount: debt.amount,
        group: debt.group,
      };
      owes.push(data);
    }
  }
  return { owes, getBacks };
};

export { getDebts };
