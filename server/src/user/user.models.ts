import { Schema, model } from "mongoose";
import { UserType } from "./user.zodSchema";

import bcrypt from "bcrypt";

const userSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (this, next: Function) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  const user = await User.findOne({
    email: this.email,
  }).select("password");

  return await bcrypt.compare(enteredPassword, user!.password);
};

const User = model("User", userSchema);

export { User, userSchema };
