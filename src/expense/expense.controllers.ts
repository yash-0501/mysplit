import { Request, Response } from "express";
import { expenseSchema, expenseTypes, splitTypes } from "./expense.zodSchema";
import { ZodError } from "zod";
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
        .populate("participants.participant", "email")
        .populate("paidBy", "email")
        .populate("createdBy", "email")
        .populate("group");
      return res.json({ expenses, user: req.user });
    } else {
      res.json({ error: "Please Login" });
    }
  } catch (err) {
    
    return res.status(400).json(err);
  }
};

interface ExpenseRequestBody {
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
    const parsedExpense = await expenseSchema.parseAsync({
      description,
      amount,
      paidBy,
      participants: splitByParticipants,
      splitType,
      expenseType,
      createdBy,
      group,
    });
    const userId = parsedExpense["paidBy"];
    try {
      const paidByUser = await User.findById(userId);
      if (!paidByUser) return res.status(404).json({ error: "Invalid User" });

      const newExpense = await createExpenseandUpdateBalance(parsedExpense);
      // const expense = await Expense.create({
      //   description,
      //   amount,
      //   paidBy: paidByUser,
      //   participants: participantUserData,
      //   splitType,
      // });
      return res
        .status(200)
        .json({ message: "Expense Added Successfully", expense: newExpense });
    } catch (err) {
      if (err instanceof Error)
        return res
          .status(500)
          .json({ error: err.message, message: "Some Error occured" });
      return res.status(500).json({ error: err, message: "Some Error occured" });
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
    const expense = await Expense.findById(expense_id);
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

const updateExpenseDetails = async (req: Request, res: Response) => {
  const expense_id = req.params.id;
  const { description, amount, paidBy, participants } = req.body;

  try {
    const expenseData = {
      description,
      amount,
      paidBy,
      participants,
    };
    const expense = await Expense.findByIdAndUpdate(expense_id, expenseData, {
      new: true,
    });
    if (!expense) return res.status(404).json({ error: "Invalid id" });
    return res.status(200).json({ expense, message: "updated successfully" });
  } catch (err) {
    if (err instanceof MongooseError) {
      const errorMessage = err;
      return res.status(404).json({ error: "Invalid id" });
    } else {
      return res.status(404).json({ message: "Some Error Occured" });
    }
  }
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
