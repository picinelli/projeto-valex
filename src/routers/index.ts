import { Router } from "express";
import cardsRouter from "./cardsRouter.js";
import employeeRouter from "./employeeRouter.js";

const router = Router()

router.use(cardsRouter)
router.use(employeeRouter)

export default router