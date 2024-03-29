import { Router } from "express";
import { addToBalance } from "./balance.services";
import { showBalance } from "./balance.controllers";

const router = Router();

router.route("/showBalance").get(showBalance);

export { router };
