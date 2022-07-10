import { Router } from "express";
import { paymentTransaction } from "../controllers/paymentsController.js";

const paymentRouter = Router()

paymentRouter.post("/payment", paymentTransaction)

export default paymentRouter