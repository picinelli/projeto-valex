import { Router } from "express";
import { rechargeCard } from "../controllers/rechargesController.js";
var rechargeRouter = Router();
rechargeRouter.post("/recharge-card", rechargeCard);
export default rechargeRouter;
