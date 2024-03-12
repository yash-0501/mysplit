import { NextFunction, Request, Response } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const uri =
    "mongodb+srv://yashagarwal:" +
    process.env.mongopw +
    "@mern-poc.rildjcz.mongodb.net/?retryWrites=true&w=majority";
  return session({
    secret: process.env.SESSION_SECRET || "dhaiddbeaicbac",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: uri,
    }),
  })(req, res, next);
};

export { sessionMiddleware };
