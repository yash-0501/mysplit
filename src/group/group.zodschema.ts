import { z } from "zod";
import { Types } from "mongoose";

const groupSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Group Name must be a string",
    description: "Name of the group",
  }),
  createdBy: z.custom<Types.ObjectId>(),
  members: z.array(z.custom<Types.ObjectId>()).nonempty({
    message: "Please add atleast one member!",
  }),
});

type GroupType = z.infer<typeof groupSchema>;

export { GroupType, groupSchema };
