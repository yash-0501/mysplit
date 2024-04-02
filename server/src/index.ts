import express, { NextFunction, Request, Response, json } from "express";
import "dotenv/config";
import { connectMongoDb } from "./dbutils/connection";
var bodyParser = require("body-parser");
import { router as expenseRouter } from "./expense/expense.router";
import { sessionMiddleware } from "./auth/session.middlewares";
import { passport } from "./auth/passport.middleware";
import { router as authRouter } from "./auth/auth.routes";
import { router as userRouter } from "./user/user.router";
import { router as groupRouter } from "./group/group.routes";
import { isLoggedIn } from "./auth/auth.middleware";
import { router as balanceRouter } from "./balance/balance.router";
var cookieParser = require("cookie-parser");
const cors = require("cors");

const uri =
  "mongodb+srv://yashagarwal:" +
  process.env.mongopw +
  "@mern-poc.rildjcz.mongodb.net/mysplit?retryWrites=true&w=majority";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

// app.use(sessionMiddleware);
// app.use(passport.initialize());
// app.use(passport.session());

const PORT = process.env.PORT;

const startServer = () => {
  app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`));
};

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Passport adds user property to the request object if user is authenticated
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to next middleware or route handler
  }
  // User is not authenticated, redirect or send an error response
  (res as Response).status(401).json({ error: "Unauthorized" });
};

app.use("/expenses", isLoggedIn, expenseRouter);
app.use("/auth", authRouter);
app.use("/users", isLoggedIn, userRouter);
app.use("/balance", isLoggedIn, balanceRouter);
app.use("/groups", isLoggedIn, groupRouter);

connectMongoDb(uri)
  .then(() => {
    startServer();
  })
  .catch((err) => console.log(err));
