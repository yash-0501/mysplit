import { Router } from "express";
import { login } from "./auth.controllers";
import { loginHandler, registerHandler } from "./auth.jwt.controller";

const router = Router();

// router.post("/login",login); // PASSPORT
router.post("/login", loginHandler); // JWT
router.post("/register", registerHandler);

export { router };
