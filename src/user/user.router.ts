import { Router } from "express";
import { handleCreateUser, listAllUsers } from "./user.controller";

const router = Router();

router.post("/createUser", handleCreateUser);

router.get("/", listAllUsers);

export { router };
