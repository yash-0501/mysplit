import { Router } from "express";
import { clearData, createGroup, editGroup, getGroupDetail, getGroupExpenseSummary, showGroups } from "./group.controller";

const router = Router();

router.route("/new").post(createGroup);
router.route("/").get(showGroups);
router.route("/clearData").delete(clearData);
router.route("/:id").get(getGroupDetail).post(editGroup);
router.route("/summary/:id").get(getGroupExpenseSummary);


export { router };
