import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.models";

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const secretKey = process.env.SESSION_SECRET || "MY53Cr37K3y";
  jwt.verify(
    token,
    secretKey,
    async (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        req.user = undefined;
        return res.status(401).json({ error: "Invalid token" });
      }
      req.user = decoded;
      const user = await User.findById(decoded._id);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      // Access the decoded user ID (e.g., decoded.userId) and perform necessary operations
      next(); // Proceed to the next middleware or route handler
    }
  );
};

export { isLoggedIn };
