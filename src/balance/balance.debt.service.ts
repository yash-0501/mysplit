import { Schema } from "mongoose";
import { User } from "../user/user.models";
import { UserType } from "../user/user.zodSchema";
import { DebtType } from "./balance.zodSchema";

type debts = {
  to: Schema.Types.ObjectId;
  debtType: String;
  amount: number;
};

const getDebts = async (debts: DebtType[], currUser: UserType) => {
  let res: debts[] = [];
  for (const debt of debts) {
    const user = await User.findOne(currUser);
    const paidByUser = await User.findOne(debt.paidBy);

    if (paidByUser?.email == user?.email) {
      res.push({ to: debt.paidTo, debtType: "gets back", amount: debt.amount });
    } else {
      res.push({ to: debt.paidBy, debtType: "owes", amount: debt.amount });
    }
  }
  return res;
};

export { getDebts };
