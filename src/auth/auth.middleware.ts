import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const secretKey = process.env.SESSION_SECRET || "MY53Cr37K3y";
  jwt.verify(token, secretKey, (err: VerifyErrors | null, decoded: any) => {
    if (err) {
      req.user = undefined;
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    // Access the decoded user ID (e.g., decoded.userId) and perform necessary operations
    next(); // Proceed to the next middleware or route handler
  });
};

export { isLoggedIn };
