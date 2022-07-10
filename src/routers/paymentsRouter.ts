import { Router } from "express";
import { paymentOnlineTransaction, paymentTransaction } from "../controllers/paymentsController.js";

const paymentRouter = Router()

paymentRouter.post("/payment", paymentTransaction)
paymentRouter.post("/payment-online", paymentOnlineTransaction)

export default paymentRouter