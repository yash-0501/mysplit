import { Schema, model } from "mongoose";
import { ExpenseType, ParticipantsType } from "./expense.zodSchema";

const expenseSchema = new Schema<ExpenseType>({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  participants: [
    {
      participant: { type: Schema.Types.ObjectId, ref: "User", required: true },
      share: { type: Number, required: true },
    },
  ],
});

const Expense = model("expense", expenseSchema);

export { Expense };
