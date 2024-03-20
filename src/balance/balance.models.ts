import { Schema, model } from "mongoose";
import { BalanceType, DebtType } from "./balance.zodSchema";
import { expenseTypes } from "../expense/expense.zodSchema";


const debtSchema = new Schema<DebtType>({
  paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  paidTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  debtType: {type: String,  enum:expenseTypes, default:expenseTypes.individual}
});

const balancechema = new Schema<BalanceType>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalBalance: { type: Number, default: 0 },
    totalShare: { type: Number, default: 0 },
    totalPaidFor: { type: Number, default: 0 },
  });

const Balance = model("Balance", balancechema);
const Debt = model("Debt", debtSchema);

export { Balance, Debt };
