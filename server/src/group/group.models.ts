import { Schema, model, set } from "mongoose";
import { GroupType } from "./group.zodschema";

const groupSchema = new Schema<GroupType>({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  totalExpense: { type: Number, default: 0 },
}, {timestamps: true});

const Group = model("Group", groupSchema);

export { Group };
