import { Request, Response } from "express";
import { User } from "../user/user.models";

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

export { handleCreateUser, listAllUsers };
