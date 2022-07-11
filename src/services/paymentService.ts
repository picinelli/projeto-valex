import * as cardRepository from "../repositories/cardRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as employeesService from "../services/employeesService.js";
import isCardExpired from "../utils/checkCardExpiration.js";
import throwError from "../utils/throwError.js";
import bcrypt from "bcrypt";
import Cryptr from "cryptr";

export async function paymentTransaction(paymentInfo: {
  cardId: number;
  password: string;
  businessId: number;
  amount: number;
}) {
  const { cardId, password, businessId, amount } = paymentInfo;
  const card = await cardRepository.findById(cardId);
  if (!card) return throwError("Card was not found!");
  if (card.originalCardId) throwError("You cannot use a virtual card on a POS")
  const business = await businessRepository.findById(businessId);
  const cardTransactions = await employeesService.getBalanceAndTransactions(
    cardId.toString()
  );

  validateBasicInfo(amount, cardTransactions, card, business);

  const isPasswordCorrect = bcrypt.compareSync(password, card.password);
  if (!isPasswordCorrect) throwError("This password is incorrect!");

  await paymentRepository.insert({ cardId, businessId, amount });
}

export async function paymentOnlineTransaction(paymentInfo: {
  number: string;
  cardholderName: string;
  expirationDate: string;
  securityCode: string;
  businessId: number;
  amount: number;
}) {
  const cryptr = new Cryptr(process.env.CRYPTR_PASS);
  const {number, cardholderName, expirationDate, securityCode, businessId, amount} = paymentInfo;
  const card = await cardRepository.findByCardDetails(number, cardholderName, expirationDate);
  if (!card) return throwError("Card was not found!");
  const cardAssigned = card.originalCardId ? card.originalCardId : card.id

  const business = await businessRepository.findById(businessId);
  const cardTransactions = await employeesService.getBalanceAndTransactions(cardAssigned.toString());

  validateBasicInfo(amount, cardTransactions, card, business);

  if (
    card.number !== number ||
    card.cardholderName !== cardholderName ||
    card.expirationDate !== expirationDate
  ) {
    throwError("The card information inserted is incorrect");
  }

  const decryptedCVC = cryptr.decrypt(card.securityCode);
  if (decryptedCVC !== securityCode) throwError("Security code is incorrect!");

  await paymentRepository.insert({ cardId: cardAssigned, businessId, amount });

}




//Utils and validation functions
function validateBasicInfo(
  amount: number,
  cardTransactions: any,
  card: cardRepository.Card,
  business: businessRepository.Business
) {

  if (amount < 1) return throwError("Insert a minimum amount of 1");
  if (cardTransactions.balance < amount)
  return throwError("You dont have balance to make this purchase");
  if (!business) return throwError("Business was not found!");
  if (business.type !== card.type)
    return throwError("Business is not of the same type of card");
  if (card.isBlocked || !card.password)
    return throwError("You must activate or unblock your card");
  if (isCardExpired(card.expirationDate)) throwError("Your card is expired");

}
