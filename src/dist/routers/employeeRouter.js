import { Router } from "express";
import { getBalanceAndTransactions } from "../controllers/employeesController.js";
var employeeRouter = Router();
employeeRouter.get("/transactions-card", getBalanceAndTransactions);
export default employeeRouter;
