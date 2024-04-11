import { Request, Response } from "express";
import { User } from "../user/user.models";
import { UserType } from "./user.zodSchema";

const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const new_user = await User.create(user);
    return res.json({ user: user });
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
    return res.json({ error: "Current user not found" });
  }
  const currentUser = allUsers.splice(currentUserIndex, 1)[0];
  allUsers.unshift(currentUser);

  return res.json(allUsers);
};

const listCurrentUser = async (req: Request, res: Response) => {
  const user = req.user as UserType;
  if (!user) return res.json({ error: "Please Login" });
  const currUser = await User.findOne({ email: user.email }, 'email name _id friends').populate('friends', "name email _id");
  if (!currUser) return res.json({ error: "Invalid User" });
  return res.json(currUser);
};

const handleAddFriend = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserType;
    if (!user) return res.json({ error: "Please Login" });

    const { friend_id } = req.body;
    if (!friend_id) return res.json({ error: "Friend ID is required" });

    const currUser = await User.findOne({ email: user.email });
    if (!currUser) return res.json({ error: "User not found" });

    const friendUser = await User.findById(friend_id);
    if (!friendUser) return res.json({ error: "Friend not found" });

    // Check if the friend already exists in the user's friend list
    if (currUser.friends.includes(friendUser._id)) {
      return res.status(400).json({ error: "Friend already added" });
    }

    // Add friend to current user's friend list
    currUser.friends.push(friendUser._id);
    await currUser.save();

    // Add current user to the friend's friend list
    friendUser.friends.push(currUser._id);
    await friendUser.save();

    return res.json({ message: "Friend added successfully" });
  } catch (error) {
    console.error("Error adding friend:", error);
    return res.json({ error: "Internal Server Error" });
  }
};


export { handleCreateUser, listAllUsers, listCurrentUser, handleAddFriend };
