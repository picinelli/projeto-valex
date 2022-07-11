var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as cardRepository from "../repositories/cardRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as employeesService from "../services/employeesService.js";
import isCardExpired from "../utils/checkCardExpiration.js";
import throwError from "../utils/throwError.js";
import bcrypt from "bcrypt";
import Cryptr from "cryptr";
export function paymentTransaction(paymentInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var cardId, password, businessId, amount, card, business, cardTransactions, isPasswordCorrect;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cardId = paymentInfo.cardId, password = paymentInfo.password, businessId = paymentInfo.businessId, amount = paymentInfo.amount;
                    return [4 /*yield*/, cardRepository.findById(cardId)];
                case 1:
                    card = _a.sent();
                    if (!card)
                        return [2 /*return*/, throwError("Card was not found!")];
                    if (card.originalCardId)
                        throwError("You cannot use a virtual card on a POS");
                    return [4 /*yield*/, businessRepository.findById(businessId)];
                case 2:
                    business = _a.sent();
                    return [4 /*yield*/, employeesService.getBalanceAndTransactions(cardId.toString())];
                case 3:
                    cardTransactions = _a.sent();
                    validateBasicInfo(amount, cardTransactions, card, business);
                    isPasswordCorrect = bcrypt.compareSync(password, card.password);
                    if (!isPasswordCorrect)
                        throwError("This password is incorrect!");
                    return [4 /*yield*/, paymentRepository.insert({ cardId: cardId, businessId: businessId, amount: amount })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function paymentOnlineTransaction(paymentInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var cryptr, number, cardholderName, expirationDate, securityCode, businessId, amount, card, cardAssigned, business, cardTransactions, decryptedCVC;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cryptr = new Cryptr(process.env.CRYPTR_PASS);
                    number = paymentInfo.number, cardholderName = paymentInfo.cardholderName, expirationDate = paymentInfo.expirationDate, securityCode = paymentInfo.securityCode, businessId = paymentInfo.businessId, amount = paymentInfo.amount;
                    return [4 /*yield*/, cardRepository.findByCardDetails(number, cardholderName, expirationDate)];
                case 1:
                    card = _a.sent();
                    if (!card)
                        return [2 /*return*/, throwError("Card was not found!")];
                    cardAssigned = card.originalCardId ? card.originalCardId : card.id;
                    return [4 /*yield*/, businessRepository.findById(businessId)];
                case 2:
                    business = _a.sent();
                    return [4 /*yield*/, employeesService.getBalanceAndTransactions(cardAssigned.toString())];
                case 3:
                    cardTransactions = _a.sent();
                    validateBasicInfo(amount, cardTransactions, card, business);
                    if (card.number !== number ||
                        card.cardholderName !== cardholderName ||
                        card.expirationDate !== expirationDate) {
                        throwError("The card information inserted is incorrect");
                    }
                    decryptedCVC = cryptr.decrypt(card.securityCode);
                    if (decryptedCVC !== securityCode)
                        throwError("Security code is incorrect!");
                    return [4 /*yield*/, paymentRepository.insert({ cardId: cardAssigned, businessId: businessId, amount: amount })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//Utils and validation functions
function validateBasicInfo(amount, cardTransactions, card, business) {
    if (amount < 1)
        return throwError("Insert a minimum amount of 1");
    if (cardTransactions.balance < amount)
        return throwError("You dont have balance to make this purchase");
    if (!business)
        return throwError("Business was not found!");
    if (business.type !== card.type)
        return throwError("Business is not of the same type of card");
    if (card.isBlocked || !card.password)
        return throwError("You must activate or unblock your card");
    if (isCardExpired(card.expirationDate))
        throwError("Your card is expired");
}
