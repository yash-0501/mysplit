import { Schema } from "mongoose";
import { z } from "zod";

const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);
type ObjectIdType = z.infer<typeof ObjectIdSchema>;

enum splitTypes {
  equal = "EQUAL",
  percentage = "PERCENTAGE",
  share = "SHARE",
  unequal = "UNEQUAL",
}

enum expenseTypes {
  individual = "INDIVIDUAL",
  group = "GROUP"
}

const participantSchema = z.object({
  participant: z.custom<Schema.Types.ObjectId>(),
  share: z.number({
    required_error: "A split amount must be entered",
    invalid_type_error: "Split Amount must be a number",
    description: "Split Amount Calculated",
  }),
});

const expenseSchema = z.object({
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description should be a string",
  }),
  amount: z.number({
    required_error: "An amount must be entered",
    invalid_type_error: "Amount must be a number",
    description: "Amount added by user",
  }),
  createdBy: z.custom<Schema.Types.ObjectId>(),
  createdAt: z.date({invalid_type_error: "Must be a datetime type object"}).optional(),
  paidBy: z.custom<Schema.Types.ObjectId>(),
  participants: participantSchema.array().nonempty({
    message: "Participants cant be empty",
  }),
  splitType: z.nativeEnum(splitTypes).readonly().default(splitTypes.equal).optional(),
  expenseType: z.nativeEnum(expenseTypes).readonly().default(expenseTypes.individual).optional(),
  group: z.custom<Schema.Types.ObjectId>().optional(),
});

const expensesListSchema = z.array(expenseSchema);

type ExpenseType = z.infer<typeof expenseSchema>;
type ParticipantsType = z.infer<typeof participantSchema>;

export {
  expenseSchema,
  ExpenseType,
  expensesListSchema,
  ParticipantsType,
  participantSchema,
  ObjectIdType,
  splitTypes,
  expenseTypes
};
