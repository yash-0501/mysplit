import { Request, Response } from "express";
import { User } from "../user/user.models";
import { UserType } from "../user/user.zodSchema";
import { Schema, Types } from "mongoose";
import { Group } from "./group.models";
import { groupSchema } from "./group.zodschema";
import { Expense } from "../expense/expense.models";
import { Balance, Debt } from "../balance/balance.models";
import { fetchGroupWiseExpenseSummary } from "../expense/service/fetchSummary.GroupWise";

const clearData = async (req: Request, res: Response) => {
  const currUser = req.user as UserType;
  if (currUser.email === "say2yasha2000@gmail.com") {
    try {
      await Expense.deleteMany({});
      // await Group.deleteMany({});
      await Group.updateMany({},{$set:{totalExpense:0}});
      // await User.deleteMany({});
      await Debt.deleteMany({});
      await Balance.deleteMany({});
      return res.json({ message: "Deleted Successfully!" });
    } catch (error) {
      res.json(error);
    }
  } else res.json({ error: "You are Unauthorized\n Stay Away Dude!" });
};

const showGroups = async (req: Request, res: Response) => {
  const reqUser = req.user as UserType;
  try {
    if (reqUser) {
      const user = await User.findOne({ email: reqUser.email });
      if (!user) return res.json({ error: "No such user" });
      const userGroups = await Group.find({
        members: user._id,
      })
        .sort({ _id: -1 })
        .populate("members", "_id email name");
      if (!userGroups || userGroups.length == 0)
        return res.json({ error: "No Groups yet, create or join one!" });
      else return res.json({ user: reqUser, groups: userGroups });
    }
  } catch (error) {
    return res.json(error);
  }
};

const getGroupExpenseSummary = async (req: Request, res: Response) => {
  const reqUser = req.user as UserType;
  const groupId = req.params.id;
  try {
    if (reqUser) {
      const user = await User.findOne({ email: reqUser.email });
      if (!user) return res.json({ error: "No such user" });

      const userGroup = await Group.findById(groupId);

      if (!userGroup)
        return res.json({ message: "No Groups yet, create or join one!" });

      const expenseData = await fetchGroupWiseExpenseSummary(
        userGroup._id,
        user._id
      );
      return res.json({ expenseData, totalGroupSpend: userGroup.totalExpense });
    }
  } catch (error) {
    return res.json(error);
  }
};

const createGroup = async (req: Request, res: Response) => {
  const reqUser = req.user as UserType;
  try {
    if (reqUser) {
      const user = await User.findOne({ email: reqUser.email });
      if (!user) return res.json({ error: "No such user" });
      const { name, groupMembers } = req.body;
      let members: Types.ObjectId[] = [];

      if (groupMembers) {
        for (const data of groupMembers) {
          const member = await User.findById(data);
          if (!member) return res.json({ error: "No such user" });
          members.push(member._id);
        }
      }

      const groupData = { name, createdBy: user._id, members: members };
      const parsedGroupData = await groupSchema.parseAsync(groupData);
      const newGroup = new Group(parsedGroupData);
      await newGroup.save();
      return res.json({
        group: newGroup,
        message: "Group Created Successfully!",
      });
    } else {
      return res.json({ error: "Unauthorized" });
    }
  } catch (error) {
    return res.json(error);
  }
};

const getGroupDetail = async (req: Request, res: Response) => {
  const reqUser = req.user as UserType;
  const groupId = req.params.id;

  try {
    if (reqUser) {
      const user = await User.findOne({ email: reqUser.email });
      if (!user) return res.json({ error: "No such user" });

      const foundGroup = await Group.findOne({ _id: groupId })
        .populate("members", "email")
        .populate("createdBy");

      if (!foundGroup)
        return res.json({ error: "No Groups yet, create or join one!" });

      return res.json({ foundGroup, message: "Group Found" });
    }
    return res.json({ error: "No such user exists!" });
  } catch (err) {
    return res.json({ error: err });
  }
};

const editGroup = async (req: Request, res: Response) => {
  const reqUser = req.user as UserType;
  const groupId = req.params.id;

  try {
    if (reqUser) {
      const user = await User.findOne({ email: reqUser.email });
      if (!user) return res.json({ error: "No such user" });

      const foundGroup = await Group.findOne({ _id: groupId });

      if (!foundGroup)
        return res.json({ error: "No Groups yet, create or join one!" });
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

      return res.json({ updatedGroup, message: "Updated Group Successfully!" });
    }
    return res.json({ error: "No such user exists!" });
  } catch (error) {
    return res.json(error);
  }
};

export {
  createGroup,
  showGroups,
  editGroup,
  clearData,
  getGroupExpenseSummary,
  getGroupDetail,
};
