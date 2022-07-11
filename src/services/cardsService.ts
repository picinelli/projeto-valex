import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";

import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import throwError from "../utils/throwError.js";
import isCardExpired from "../utils/checkCardExpiration.js";

export async function createCard(
  body: {
    employeeId: number;
    type: "groceries" | "restaurant" | "transport" | "education" | "health";
  },
  API: string
) {
  const company = await companyRepository.findByApiKey(API);
  const user = await employeeRepository.findById(body.employeeId);
  const cardType = await cardRepository.findByTypeAndEmployeeId(
    body.type,
    body.employeeId
  );

  const cryptr = new Cryptr(process.env.CRYPTR_PASS);

  validateInfo(company, user, cardType);

  const cardholderName = createUserCardName(user.fullName);
  const number = faker.finance.creditCardNumber("63[7-9]#-####-####-###L");
  const expirationDate = dayjs().add(5, "years").format("MM/YY");
  const securityCode = faker.finance.creditCardCVV()
  const encryptedSecurityCode = cryptr.encrypt(securityCode)

  const cardInfo: cardRepository.CardInsertData = {
    employeeId: body.employeeId,
    number,
    cardholderName,
    securityCode: encryptedSecurityCode,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: true,
    type: body.type,
  };

  await cardRepository.insert(cardInfo);
  return securityCode
}

export async function createVirtualCard(
  body: {
    originalCardId: number,
    password: string
  },

) {
  const {password, originalCardId} = body
  const originalCard = await cardRepository.findById(originalCardId)
  const cryptr = new Cryptr(process.env.CRYPTR_PASS);
  const number = faker.finance.creditCardNumber("63[7-9]#-####-####-###L");
  const expirationDate = dayjs().add(5, "years").format("MM/YY");
  const securityCode = faker.finance.creditCardCVV()
  const encryptedSecurityCode = cryptr.encrypt(securityCode)

  if(!originalCard) throwError("Original card was not found!")
  const isPasswordCorrect = bcrypt.compareSync(password, originalCard.password)
  if(!isPasswordCorrect) throwError("This password is incorrect!")

  const cardInfo: cardRepository.CardInsertData = {
    employeeId: originalCard.employeeId,
    number,
    cardholderName: originalCard.cardholderName,
    securityCode: encryptedSecurityCode,
    expirationDate,
    password: originalCard.password,
    isVirtual: true,
    originalCardId,
    isBlocked: false,
    type: originalCard.type
  };

  await cardRepository.insert(cardInfo);

  return securityCode
}

export async function deleteCard(cardInfo: {
  id: number,
  password: string
}) {
  const { id, password } = cardInfo;

  const card = await cardRepository.findById(id);
  if (!card) throwError("Card not identified!");
  if (!card.originalCardId) throwError("This is not a virtual card!")
  const isPasswordCorrect = bcrypt.compareSync(password, card.password)
  if(!isPasswordCorrect) throwError("This password is incorrect!")

  await cardRepository.remove(id)
}

export async function activateCard(cardInfo: {
  id: number;
  securityCode: string;
  password: string;
}) {
  const { id, securityCode, password } = cardInfo;
  const saltRounds = 10
  const hashPassword = bcrypt.hashSync(password, saltRounds);

  const card = await cardRepository.findById(id);
  if (!card) throwError("Card not identified!");
  if (card.originalCardId) throwError("You cannot activate a virtual card")

  await validateActivationCardInfo(card, securityCode, password);
  await cardRepository.update(card.id, {isBlocked: false, password: hashPassword})
}

export async function blockCardById(cardInfo: {id: number, password: string}) {
  const {id, password} = cardInfo
  const card = await cardRepository.findById(id)
  if(!card) throwError("Card was not found!")
  const isPasswordCorrect = bcrypt.compareSync(password, card.password)

  if(isCardExpired(card.expirationDate)) throwError("This card is expired!")
  if(card.isBlocked === true) throwError("This card is already blocked!")
  if(!isPasswordCorrect) throwError("This password is incorrect!")

  await cardRepository.update(id, {isBlocked: true})
}

export async function unblockCardById(cardInfo: {id: number, password: string}) {
  const {id, password} = cardInfo
  const card = await cardRepository.findById(id)
  if(!card) throwError("Card was not found!")
  const isPasswordCorrect = bcrypt.compareSync(password, card.password)

  if(isCardExpired(card.expirationDate)) throwError("This card is expired!")
  if(card.isBlocked === false) throwError("This card is already unblocked!")
  if(!isPasswordCorrect) throwError("This password is incorrect!")

  await cardRepository.update(id, {isBlocked: false})
}

//Utils and validation functions
function validateInfo(
  company: companyRepository.Company,
  user: employeeRepository.Employee,
  cardType: cardRepository.Card
) {
  if (!company) throwError("Company not identified!");
  if (!user) throwError("User not identified!");
  if (cardType) throwError("Card Type already exists!");
}

function createUserCardName(name: string) {
  const arr = name.split(" ");
  const lastName = arr.length - 1;
  arr[0] = arr[0].toUpperCase();
  arr[lastName] = arr[lastName].toUpperCase();

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length < 3) {
      arr.splice(i, 1);
    }
    if (i !== 0 && i !== arr.length - 1) {
      arr[i] = arr[i][0].toUpperCase();
    }
  }
  return arr.join(" ");
}

async function validateActivationCardInfo(
  card: cardRepository.Card,
  securityCode: string,
  password: string
) {

  const cryptr = new Cryptr(process.env.CRYPTR_PASS);
  const decryptedCVC = cryptr.decrypt(card.securityCode);
  const numberedPass = +password

  if (isCardExpired(card.expirationDate)) throwError("This card is expired!");
  if (card.password) throwError("This card is already activated!");
  if (decryptedCVC !== securityCode) throwError("Security code is incorrect!");
  if (password.length !== 4) throwError("Password size incorrect (4)");
  if(typeof(numberedPass) !== 'number') throwError("Password must be 4 numbers");
}
