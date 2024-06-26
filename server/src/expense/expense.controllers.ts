import { Request, Response } from "express";
import {
  ExpenseType,
  expenseSchema,
  expenseTypes,
  splitTypes,
} from "./expense.zodSchema";
import { Schema, ZodError } from "zod";
import { Expense } from "./expense.models";
import { MongooseError, ObjectId, startSession } from "mongoose";
import { User } from "../user/user.models";
import { fetchEqualSplit } from "./service/split.equal";
import { fetchPercentageSplit } from "./service/split.percentage";
import { fetchShareSplit } from "./service/split.share";
import { fetchUnequalSplit } from "./service/split.unequal";
import { isValidSplit } from "./service/split.isValid";
import { UserType } from "../user/user.zodSchema";
import { createExpenseandUpdateBalance } from "./expense.create";
import { getExpenseSummary } from "./service/fetchExpenseSummary";

const getAllExpensesHandler = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const reqUser = req.user as UserType;
      const user = await User.findOne({ email: reqUser.email });
      if (!user) return res.status(401).json({ error: "No such user" });

      const expenses = await Expense.find({
        $or: [
          { createdBy: user },
          { "participants.participant": user },
          { paidBy: user },
        ],
      })
        .sort({ _id: -1 })
        .populate("participants.participant")
        .populate("paidBy")
        .populate("createdBy")
        .populate("group");
      const response = await getExpenseSummary(expenses, user._id);
      return res.json({ expenses: response });
    } else {
      res.json({ error: "Please Login" });
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

interface ExpenseRequestBody {
  expenseDate: Date,
  description: string;
  amount: number;
  paidBy: string;
  participants: ObjectId[];
  splitType?: string;
  splitShares?: number[];
  expenseType?: string;
  group?: ObjectId;
}

const addExpenseHandler = async (
  req: Request<ExpenseRequestBody>,
  res: Response
) => {
  const {
    expenseDate,
    description,
    amount,
    paidBy,
    participants,
    splitType = splitTypes.equal,
    splitShares = [],
    group,
  } = req.body as ExpenseRequestBody;
  let expenseType = expenseTypes.individual;
  if (group) expenseType = expenseTypes.group;
  const createdBy = req.user;
  if (!createdBy) return res.json({ error: "Please Login" });

  if (splitType.toUpperCase() != splitTypes.equal) {
    if (isValidSplit(splitShares) == 1) {
      return res.status(401).json({ error: "A split is required!" });
    } else if (isValidSplit(splitShares) == 2) {
      return res.status(401).json({ error: "A split must be a number." });
    }
  }
  let splitByParticipants;
  switch (splitType.toUpperCase()) {
    case splitTypes.percentage:
      splitByParticipants = fetchPercentageSplit(
        participants,
        amount,
        splitShares
      );
      break;
    case splitTypes.unequal:
      // handles UNEQUAL case

      splitByParticipants = fetchUnequalSplit(
        participants,
        amount,
        splitShares
      );
      break;
    case splitTypes.share:
      // handles SHARE case

      splitByParticipants = fetchShareSplit(participants, amount, splitShares);
      break;
    default:
      // handles equal case
      splitByParticipants = fetchEqualSplit(participants, amount);
      break;
  }
  if (splitByParticipants === null)
    return res
      .status(401)
      .json({ error: "Please check total split and participants." });
  try {
    const createdAt = new Date();
    const expenseDateObj = new Date(expenseDate);
    const parsedExpense = await expenseSchema.parseAsync({
      expenseDate:expenseDateObj,
      description,
      amount,
      paidBy,
      participants: splitByParticipants,
      splitType,
      expenseType,
      createdBy,
      createdAt,
      group,
    });
    const userId = parsedExpense["paidBy"];
    try {
      const paidByUser = await User.findById(userId);
      if (!paidByUser) return res.status(404).json({ error: "Invalid User" });

      const newExpense = await createExpenseandUpdateBalance(parsedExpense);
      return res
        .status(200)
        .json({ message: "Expense Added Successfully", expense: newExpense });
    } catch (err) {
      if (err instanceof Error)
        return res
          .status(500)
          .json({ error: err.message, message: "Some Error occured" });
      return res
        .status(500)
        .json({ error: err, message: "Some Error occured" });
    }
  } catch (err) {
    if (err instanceof ZodError) {
      const errorMessage = err.errors.map((err) => err.message).join(", ");
      return res
        .status(401)
        .json({ error: errorMessage, message: "Some error occured" });
    } else return res.status(401).json({ message: "Some Error Occured", err });
  }
};

const getExpenseDetailsHandler = async (req: Request, res: Response) => {
  const expense_id = req.params.id;

  try {
    const expense = await Expense.findById(expense_id)
    .populate("participants.participant")
        .populate("paidBy")
        .populate("createdBy")
        .populate("group");
    if (!expense) return res.status(404).json({ error: "Invalid id" });
    return res.status(200).json(expense);
  } catch (err) {
    if (err instanceof MongooseError) {
      const errorMessage = err;
      return res.status(404).json({ error: "Invalid id" });
    } else {
      return res.status(404).json({ message: "Some Error Occured" });
    }
  }
};

// When expense is updated - update expense, balance, debt based on group or individual
// update group data as well totalExxpense
const updateExpenseDetails = async (req: Request, res: Response) => {
  return res.json({ error: "Module under development!" });
  // const expense_id = req.params.id;
  // const { description, amount, paidBy, participants } = req.body;

  // try {
  //   const expenseData = {
  //     description,
  //     amount,
  //     paidBy,
  //     participants,
  //   };
  //   const expense = await Expense.findByIdAndUpdate(expense_id, expenseData, {
  //     new: true,
  //   });
  //   if (!expense) return res.status(404).json({ error: "Invalid id" });
  //   return res.status(200).json({ expense, message: "updated successfully" });
  // } catch (err) {
  //   if (err instanceof MongooseError) {
  //     const errorMessage = err;
  //     return res.status(404).json({ error: "Invalid id" });
  //   } else {
  //     return res.status(404).json({ message: "Some Error Occured" });
  //   }
  // }
};

const deleteExpense = async (req: Request, res: Response) => {
  const expense_id = req.params.id;
  try {
    const expense = await Expense.findByIdAndDelete(expense_id);
    if (!expense) return res.status(404).json({ error: "Invalid id" });
    return res.status(200).json({ message: "Expense Deleted" });
  } catch (err) {
    if (err instanceof MongooseError) {
      const errorMessage = err;
      return res.status(404).json({ error: "Invalid id" });
    } else {
      return res.status(404).json({ message: "Some Error Occured" });
    }
  }
};

export {
  addExpenseHandler,
  getAllExpensesHandler,
  getExpenseDetailsHandler,
  deleteExpense,
  updateExpenseDetails,
};
