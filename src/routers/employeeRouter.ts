import { Router } from "express";
import { getBalanceAndTransactions } from "../controllers/employeesController.js";

const employeeRouter = Router()

employeeRouter.get("/transactions-card", getBalanceAndTransactions)

export default employeeRouter