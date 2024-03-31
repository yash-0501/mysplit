import { Router } from "express";
import { handleCreateUser, listAllUsers, listCurrentUser } from "./user.controller";
import { isLoggedIn } from "../auth/auth.middleware";

const router = Router();

router.post("/createUser", handleCreateUser);

router.get("/", listAllUsers);
router.get("/profile", isLoggedIn,  listCurrentUser);

export { router };
