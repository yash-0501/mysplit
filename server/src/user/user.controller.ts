import { Request, Response } from "express";
import { User } from "../user/user.models";
import { UserType } from "./user.zodSchema";

const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const new_user = await User.create(user);
    return res.status(200).json({ user: user });
  } catch (err) {
    return res.json({ error: err });
  }
};

const listAllUsers = async (req: Request, res: Response) => {
  const currUser = req.user as UserType;
  const allUsers = await User.find({}, "_id email name").sort({ name: 1 });
  if (allUsers.length < 1) return res.json({ error: "No user found" });
  const currentUserIndex = allUsers.findIndex(
    (user) => user.email === currUser.email
  );
  if (currentUserIndex === -1) {
    return res.status(404).json({ error: "Current user not found" });
  }
  const currentUser = allUsers.splice(currentUserIndex, 1)[0];
  allUsers.unshift(currentUser);

  return res.json(allUsers);
};

const listCurrentUser = async (req: Request, res: Response) => {
  const user = req.user as UserType;

  if (!user) return res.json({ error: "Please Login" });
  const currUser = await User.findOne({ email: user.email }, 'email name _id');
  if (!currUser) return res.json({ error: "Please Login" });
  return res.json(currUser);
};

export { handleCreateUser, listAllUsers, listCurrentUser };
