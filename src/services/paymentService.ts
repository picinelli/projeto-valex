import * as cardRepository from "../repositories/cardRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as employeesService from "../services/employeesService.js"
import isCardExpired from "../utils/checkCardExpiration.js";
import throwError from "../utils/throwError.js";
import bcrypt from "bcrypt";

export async function paymentTransaction(paymentInfo: {
  cardId: number;
  password: string;
  businessId: number;
  amount: number;
}) {
  const {cardId, password, businessId, amount} = paymentInfo
  const card = await cardRepository.findById(cardId)
  const business = await businessRepository.findById(businessId)
  const cardTransactions = await employeesService.getBalanceAndTransactions(cardId.toString())

  if(amount < 1) throwError("Insert a minimum amount of 1")
  if(cardTransactions.balance < amount) throwError("You dont have balance to make this purchase")
  if(!card) throwError("Card was not found!")
  if(!business) throwError("Business was not found!")
  if(business.type !== card.type) throwError("Business is not of the same type of card")
  if(card.isBlocked || !card.password) throwError("You must activate or unblock your card")
  if(isCardExpired(card.expirationDate)) throwError("Your card is expired")

  const isPasswordCorrect = bcrypt.compareSync(password, card.password)
  if(!isPasswordCorrect) throwError("This password is incorrect!")

  await paymentRepository.insert({cardId, businessId, amount})
}
