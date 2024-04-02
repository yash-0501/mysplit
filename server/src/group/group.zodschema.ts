import { z } from "zod";
import { Types } from "mongoose";

const groupSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Group Name must be a string",
    description: "Name of the group",
  }),
  createdBy: z.custom<Types.ObjectId>(),
  createdAt: z
    .date({ invalid_type_error: "Must be a datetime type object" })
    .optional(),
  members: z.array(z.custom<Types.ObjectId>()).nonempty({
    message: "Please add atleast one member!",
  }),
  totalExpense: z
    .number({
      invalid_type_error: "Must be a number",
    })
    .default(0),
});

type GroupType = z.infer<typeof groupSchema>;

export { GroupType, groupSchema };
