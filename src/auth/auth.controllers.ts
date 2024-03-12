import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { UserType } from "../user/user.zodSchema";

const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    function (err: Error, user: UserType, info: String) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ error: "Incorrect Creds" });
      }
      req.login(user, (err) => {
        if (err) throw err;
        res.status(201).json({ user });
      });
    }
  )(req, res, next);
};

export { login };
