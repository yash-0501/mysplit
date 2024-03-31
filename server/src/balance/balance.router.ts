import { Router } from "express";
import { addToBalance } from "./balance.services";
import { getbalanceSummary, showBalance } from "./balance.controllers";

const router = Router();

router.route("/show").get(showBalance);
router.route("/summary").get(getbalanceSummary);

export { router };
