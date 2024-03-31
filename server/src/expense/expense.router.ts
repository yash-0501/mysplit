import { Router } from "express";
import {
  addExpenseHandler,
  getAllExpensesHandler,
  getExpenseDetailsHandler,
  updateExpenseDetails,
  deleteExpense,
} from "./expense.controllers";

const router = Router();

router.post("/add", addExpenseHandler);
router.get("/", getAllExpensesHandler);
router
  .route("/:id")
  .get(getExpenseDetailsHandler)
  .patch(updateExpenseDetails)
  .delete(deleteExpense);

export { router };
