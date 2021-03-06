import { Router } from "express";
import { activateCard, blockCard, createCard, createVirtualCard, deleteVirtualCard, unblockCard } from "../controllers/cardsController.js";
import { validateApiKeyAndCardType } from "../middlewares/validateApiKeyAndCardTypeMiddleware.js";

const cardsRouter = Router()

cardsRouter.post("/create-card", validateApiKeyAndCardType, createCard)
cardsRouter.post("/create-virtual-card", createVirtualCard)
cardsRouter.post("/delete-virtual-card", deleteVirtualCard)
cardsRouter.post("/activate-card", activateCard)
cardsRouter.post("/block-card", blockCard)
cardsRouter.post("/unblock-card", unblockCard)

export default cardsRouter