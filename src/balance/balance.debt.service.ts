import { Schema } from "mongoose";
import { User } from "../user/user.models";
import { UserType } from "../user/user.zodSchema";
import { DebtType } from "./balance.zodSchema";

type debts = {
  to: Schema.Types.ObjectId;
  debtType: String;
  amount: number;
  group?: Schema.Types.ObjectId | undefined;
};

const getDebts = async (debts: DebtType[], currUser: UserType) => {
  let res: debts[] = [];
  for (const debt of debts) {
    const user = await User.findOne(currUser);
    const paidByUser = await User.findOne(debt.paidBy);

    let data;

    if (paidByUser?.email == user?.email) {
      data = { to: debt.paidTo, debtType: "gets back", amount: debt.amount, group: debt.group };
    } else {
      data = { to: debt.paidBy, debtType: "owes", amount: debt.amount, group: debt.group };
    }
    res.push(data);
  }
  return res;
};

export { getDebts };
