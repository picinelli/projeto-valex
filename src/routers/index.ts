import { Router } from "express";
import cardsRouter from "./cardsRouter.js";
import employeeRouter from "./employeeRouter.js";
import paymentRouter from "./paymentsRouter.js";
import rechargeRouter from "./rechargesRouter.js";

const router = Router()

router.use(cardsRouter)
router.use(employeeRouter)
router.use(rechargeRouter)
router.use(paymentRouter)

export default router