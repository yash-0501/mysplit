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
  const allUsers = await User.find({});
  if (allUsers.length < 1) return res.json({ error: "No user found" });
  return res.json(allUsers);
};

const listCurrentUser = async (req: Request, res: Response) => {
  const user = req.user as UserType
  
  if(!user)
  return res.json({ error: "Please Login" });
  const currUser = await User.findOne({email:user.email});
  if (!currUser) return res.json({ error: "Please Login" });
  return res.json({email:currUser.email, name: currUser.name});
};

export { handleCreateUser, listAllUsers, listCurrentUser };
