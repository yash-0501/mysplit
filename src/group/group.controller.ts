import { Request, Response } from "express";
import { User } from "../user/user.models";
import { UserType } from "../user/user.zodSchema";
import { Types } from "mongoose";
import { Group } from "./group.models";
import { groupSchema } from "./group.zodschema";
import { Expense } from "../expense/expense.models";
import { Balance, Debt } from "../balance/balance.models";

const clearData = async (req: Request, res: Response) => {
  try {
    await Expense.deleteMany({});
    await Group.deleteMany({});
    await Debt.deleteMany({});
    await Balance.deleteMany({});
    return res.json({ message: "Deleted Successfully!" });
  } catch (err) {
    res.json(err);
  }
};

const showGroups = async (req: Request, res: Response) => {
  const reqUser = req.user as UserType;
  try {
    if (reqUser) {
      const user = await User.findOne({ email: reqUser.email });
      if (!user) return res.status(401).json({ error: "No such user" });
      const userGroups = await Group.find({
        members: user._id,
      }).sort({ _id: -1 });
      if (!userGroups || userGroups.length == 0)
        return res.json({ message: "No Groups yet, create or join one!" });
      else return res.json({ user: reqUser, groups: userGroups });
    }
  } catch (err) {
    return res.json(err);
  }
};

const createGroup = async (req: Request, res: Response) => {
  const reqUser = req.user as UserType;
  try {
    if (reqUser) {
      const user = await User.findOne({ email: reqUser.email });
      if (!user) return res.status(401).json({ error: "No such user" });
      const { name, groupMembers } = req.body;
      let members: Types.ObjectId[] = [];

      members.push(user._id);
      if (groupMembers) {
        for (const data of groupMembers) {
          const member = await User.findById(data);
          if (!member) return res.status(401).json({ error: "No such user" });
          if (member._id == user._id) continue;
          members.push(member._id);
        }
      }

      const groupData = { name, createdBy: user._id, members: members };
      const parsedGroupData = await groupSchema.parseAsync(groupData);
      const newGroup = new Group(parsedGroupData);
      await newGroup.save();
      return res.status(200).json({ group: newGroup });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    return res.json(err);
  }
};

const editGroup = async (req: Request, res: Response) => {
  const reqUser = req.user as UserType;
  const groupId = req.params.id;

  try {
    if (reqUser) {
      const user = await User.findOne({ email: reqUser.email });
      if (!user) return res.status(401).json({ error: "No such user" });
      
      const foundGroup = await Group.findOne({ _id: groupId });

      if (!foundGroup)
        return res.json({ message: "No Groups yet, create or join one!" });
      let { name, members = [] } = req.body;

      if (!name) name = foundGroup.name;
      if (members.length == 0) members = foundGroup.members;
      const updatedGroup = await Group.findOneAndUpdate(
        {
          _id: groupId,
        },
        { name, members },
        { new: true }
      );
      
      return res.json(updatedGroup);
    }
    return res.json({ message: "No such user exists!" });
  } catch (err) {
    return res.json(err);
  }
};

export { createGroup, showGroups, editGroup, clearData };
