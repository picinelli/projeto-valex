import { Router } from "express";
import { rechargeCard } from "../controllers/rechargesController.js";

const rechargeRouter = Router()

rechargeRouter.post("/recharge-card", rechargeCard)

export default rechargeRouter