import { z } from "zod";
import { UserType } from "../user/user.zodSchema";
import { Schema } from "mongoose";
import { expenseTypes } from "../expense/expense.zodSchema";

const debtSchema = z.object({
  paidBy: z.custom<Schema.Types.ObjectId>(),
  paidTo: z.custom<Schema.Types.ObjectId>(),
  amount: z.number({
    required_error: "An amount is required.",
    invalid_type_error: "Type for amount must be a number",
  }),
  debtType: z.nativeEnum(expenseTypes).default(expenseTypes.individual),
  group: z.custom<Schema.Types.ObjectId>().optional(),
});

type DebtType = z.infer<typeof debtSchema>;

const balanceSchema = z.object({
  user: z.custom<Schema.Types.ObjectId>(),
  totalBalance: z.number().default(0),
  totalShare: z.number().default(0),
  totalPaidFor: z.number().default(0),
  balanceType: z.nativeEnum(expenseTypes).default(expenseTypes.individual),
  group: z.custom<Schema.Types.ObjectId>().optional(),
});

type BalanceType = z.infer<typeof balanceSchema>;

export { DebtType, BalanceType, debtSchema, balanceSchema };
