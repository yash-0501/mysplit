import { Request, Response } from "express";
import { expenseSchema } from "./expense.zodSchema";
import { ZodError } from "zod";
import { Expense } from "./expense.models";
import { MongooseError } from "mongoose";
import { User } from "../user/user.models";

const getAllExpensesHandler = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find({});
    return res.json({ expenses, user: req.user });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

const addExpenseHandler = async (req: Request, res: Response) => {
  const { description, amount, paidBy, participants } = req.body;

  try {
    const parsedExpense = await expenseSchema.parseAsync({
      description,
      amount,
      paidBy,
      participants,
    });
    const userId = parsedExpense["paidBy"];
    try {
      const paidByUser = await User.findById(userId);
      if (!paidByUser) return res.status(404).json({ error: "Invalid User" });

      //@ts-ignore
      let participantUserData = [];
      const participantsData = parsedExpense["participants"];
      for (let i = 0; i < participantsData.length; i++) {
        const pData = participantsData[i];
        const participantUser = await User.findById(pData.participant);

        if (!participantUser)
          return res.status(404).json({ error: "Invalid User" });
        participantUserData.push({
          participant: participantUser,
          share: pData.share,
        });
      }

      const expense = await Expense.create({
        description,
        amount,
        paidBy: paidByUser,
        participants: participantUserData,
      });
      return res
        .status(200)
        .json({ message: "Expense Added Successfully", expense: expense });
    } catch (err) {
      res.status(500).json({ err, message: "Some Error occured" });
    }
  } catch (err) {
    if (err instanceof ZodError) {
      // console.log(err);
      const errorMessage = err.errors.map((err) => err.message).join(", ");
      return res
        .status(401)
        .json({ error: errorMessage, message: "Some error occurred" });
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
