import mongoose from "mongoose";
import { User } from "../user/user.models";
import { Balance } from "../balance/balance.models";
import { UserType } from "../user/user.zodSchema";

async function createUserAndBalance(userData: UserType) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = new User(userData);
    await user.save({ session }); // Save user within the transaction

    // Attempt to create balance table for the user
    const balance = new Balance({ user: user });
    await balance.save({ session }); // Save balance within the transaction

    await session.commitTransaction(); // Commit the transaction
    session.endSession();
  } catch (error) {
    console.error("Error creating user and balance:", error);

    await session.abortTransaction(); // Rollback the transaction
    session.endSession();

    // Handle rollback failure if necessary
    throw error;
  }
}

export { createUserAndBalance };
