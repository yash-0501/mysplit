import { Schema, model } from "mongoose";
import { ExpenseType, expenseTypes, splitTypes } from "./expense.zodSchema";

const expenseSchema = new Schema<ExpenseType>(
  {
    description: { type: String, required: true },
    amount: {
      type: Number,
      required: true,
      get: (v: number) => parseFloat(v.toFixed(2)),
      set: (v: number) => parseFloat(v.toFixed(2)),
      min: 0,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now() },
    expenseDate: { type: Date, default: Date.now() },
    paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [
      {
        participant: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        share: {
          type: Number,
          required: true,
          get: (v: number) => parseFloat(v.toFixed(2)),
          set: (v: number) => parseFloat(v.toFixed(2)),
        },
      },
    ],
    splitType: {
      type: String,
      enum: splitTypes,
      default: splitTypes.equal,
      required: true,
    },
    expenseType: {
      type: String,
      enum: expenseTypes,
      default: expenseTypes.individual,
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: false,
    },
  },
  { timestamps: true }
);

const Expense = model("expense", expenseSchema);

export { Expense };
