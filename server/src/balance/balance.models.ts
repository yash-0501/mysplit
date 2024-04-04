import { Schema, model } from "mongoose";
import { BalanceType, DebtType } from "./balance.zodSchema";
import { expenseTypes } from "../expense/expense.zodSchema";

const debtSchema = new Schema<DebtType>({
  paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  paidTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: {
    type: Number,
    required: true,
    get: (v: number) => parseFloat(v.toFixed(2)),
    set: (v: number) => parseFloat(v.toFixed(2)),
  },
  debtType: {
    type: String,
    enum: expenseTypes,
    default: expenseTypes.individual,
  },
  group: { type: Schema.Types.ObjectId, ref: "Group", required: false },
});

const balancechema = new Schema<BalanceType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalBalance: {
    type: Number,
    default: 0,
    get: (v: number) => parseFloat(v.toFixed(2)),
    set: (v: number) => parseFloat(v.toFixed(2)),
  },
  totalShare: {
    type: Number,
    default: 0,
    get: (v: number) => parseFloat(v.toFixed(2)),
    set: (v: number) => parseFloat(v.toFixed(2)),
  },
  totalPaidFor: {
    type: Number,
    default: 0,
    get: (v: number) => parseFloat(v.toFixed(2)),
    set: (v: number) => parseFloat(v.toFixed(2)),
  },
  balanceType: {
    type: String,
    enum: expenseTypes,
    default: expenseTypes.individual,
  },
  group: { type: Schema.Types.ObjectId, ref: "Group", required: false },
});

const Balance = model("Balance", balancechema);
const Debt = model("Debt", debtSchema);

export { Balance, Debt };
