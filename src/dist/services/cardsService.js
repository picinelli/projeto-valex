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
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import throwError from "../utils/throwError.js";
import isCardExpired from "../utils/checkCardExpiration.js";
export function createCard(body, API) {
    return __awaiter(this, void 0, void 0, function () {
        var company, user, cardType, cryptr, cardholderName, number, expirationDate, securityCode, encryptedSecurityCode, cardInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, companyRepository.findByApiKey(API)];
                case 1:
                    company = _a.sent();
                    return [4 /*yield*/, employeeRepository.findById(body.employeeId)];
                case 2:
                    user = _a.sent();
                    return [4 /*yield*/, cardRepository.findByTypeAndEmployeeId(body.type, body.employeeId)];
                case 3:
                    cardType = _a.sent();
                    cryptr = new Cryptr(process.env.CRYPTR_PASS);
                    validateInfo(company, user, cardType);
                    cardholderName = createUserCardName(user.fullName);
                    number = faker.finance.creditCardNumber("63[7-9]#-####-####-###L");
                    expirationDate = dayjs().add(5, "years").format("MM/YY");
                    securityCode = faker.finance.creditCardCVV();
                    encryptedSecurityCode = cryptr.encrypt(securityCode);
                    cardInfo = {
                        employeeId: body.employeeId,
                        number: number,
                        cardholderName: cardholderName,
                        securityCode: encryptedSecurityCode,
                        expirationDate: expirationDate,
                        password: null,
                        isVirtual: false,
                        originalCardId: null,
                        isBlocked: true,
                        type: body.type
                    };
                    return [4 /*yield*/, cardRepository.insert(cardInfo)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, securityCode];
            }
        });
    });
}
export function createVirtualCard(body) {
    return __awaiter(this, void 0, void 0, function () {
        var password, originalCardId, originalCard, cryptr, number, expirationDate, securityCode, encryptedSecurityCode, isPasswordCorrect, cardInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    password = body.password, originalCardId = body.originalCardId;
                    return [4 /*yield*/, cardRepository.findById(originalCardId)];
                case 1:
                    originalCard = _a.sent();
                    cryptr = new Cryptr(process.env.CRYPTR_PASS);
                    number = faker.finance.creditCardNumber("63[7-9]#-####-####-###L");
                    expirationDate = dayjs().add(5, "years").format("MM/YY");
                    securityCode = faker.finance.creditCardCVV();
                    encryptedSecurityCode = cryptr.encrypt(securityCode);
                    if (!originalCard)
                        throwError("Original card was not found!");
                    isPasswordCorrect = bcrypt.compareSync(password, originalCard.password);
                    if (!isPasswordCorrect)
                        throwError("This password is incorrect!");
                    cardInfo = {
                        employeeId: originalCard.employeeId,
                        number: number,
                        cardholderName: originalCard.cardholderName,
                        securityCode: encryptedSecurityCode,
                        expirationDate: expirationDate,
                        password: originalCard.password,
                        isVirtual: true,
                        originalCardId: originalCardId,
                        isBlocked: false,
                        type: originalCard.type
                    };
                    return [4 /*yield*/, cardRepository.insert(cardInfo)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, securityCode];
            }
        });
    });
}
export function deleteCard(cardInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var id, password, card, isPasswordCorrect;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = cardInfo.id, password = cardInfo.password;
                    return [4 /*yield*/, cardRepository.findById(id)];
                case 1:
                    card = _a.sent();
                    if (!card)
                        throwError("Card not identified!");
                    if (!card.originalCardId)
                        throwError("This is not a virtual card!");
                    isPasswordCorrect = bcrypt.compareSync(password, card.password);
                    if (!isPasswordCorrect)
                        throwError("This password is incorrect!");
                    return [4 /*yield*/, cardRepository.remove(id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function activateCard(cardInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var id, securityCode, password, saltRounds, hashPassword, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = cardInfo.id, securityCode = cardInfo.securityCode, password = cardInfo.password;
                    saltRounds = 10;
                    hashPassword = bcrypt.hashSync(password, saltRounds);
                    return [4 /*yield*/, cardRepository.findById(id)];
                case 1:
                    card = _a.sent();
                    if (!card)
                        throwError("Card not identified!");
                    if (card.originalCardId)
                        throwError("You cannot activate a virtual card");
                    return [4 /*yield*/, validateActivationCardInfo(card, securityCode, password)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, cardRepository.update(card.id, { isBlocked: false, password: hashPassword })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function blockCardById(cardInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var id, password, card, isPasswordCorrect;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = cardInfo.id, password = cardInfo.password;
                    return [4 /*yield*/, cardRepository.findById(id)];
                case 1:
                    card = _a.sent();
                    if (!card)
                        throwError("Card was not found!");
                    isPasswordCorrect = bcrypt.compareSync(password, card.password);
                    if (isCardExpired(card.expirationDate))
                        throwError("This card is expired!");
                    if (card.isBlocked === true)
                        throwError("This card is already blocked!");
                    if (!isPasswordCorrect)
                        throwError("This password is incorrect!");
                    return [4 /*yield*/, cardRepository.update(id, { isBlocked: true })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function unblockCardById(cardInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var id, password, card, isPasswordCorrect;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = cardInfo.id, password = cardInfo.password;
                    return [4 /*yield*/, cardRepository.findById(id)];
                case 1:
                    card = _a.sent();
                    if (!card)
                        throwError("Card was not found!");
                    isPasswordCorrect = bcrypt.compareSync(password, card.password);
                    if (isCardExpired(card.expirationDate))
                        throwError("This card is expired!");
                    if (card.isBlocked === false)
                        throwError("This card is already unblocked!");
                    if (!isPasswordCorrect)
                        throwError("This password is incorrect!");
                    return [4 /*yield*/, cardRepository.update(id, { isBlocked: false })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//Utils and validation functions
function validateInfo(company, user, cardType) {
    if (!company)
        throwError("Company not identified!");
    if (!user)
        throwError("User not identified!");
    if (cardType)
        throwError("Card Type already exists!");
}
function createUserCardName(name) {
    var arr = name.split(" ");
    var lastName = arr.length - 1;
    arr[0] = arr[0].toUpperCase();
    arr[lastName] = arr[lastName].toUpperCase();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].length < 3) {
            arr.splice(i, 1);
        }
        if (i !== 0 && i !== arr.length - 1) {
            arr[i] = arr[i][0].toUpperCase();
        }
    }
    return arr.join(" ");
}
function validateActivationCardInfo(card, securityCode, password) {
    return __awaiter(this, void 0, void 0, function () {
        var cryptr, decryptedCVC, numberedPass;
        return __generator(this, function (_a) {
            cryptr = new Cryptr(process.env.CRYPTR_PASS);
            decryptedCVC = cryptr.decrypt(card.securityCode);
            numberedPass = +password;
            if (isCardExpired(card.expirationDate))
                throwError("This card is expired!");
            if (card.password)
                throwError("This card is already activated!");
            if (decryptedCVC !== securityCode)
                throwError("Security code is incorrect!");
            if (password.length !== 4)
                throwError("Password size incorrect (4)");
            if (typeof (numberedPass) !== 'number')
                throwError("Password must be 4 numbers");
            return [2 /*return*/];
        });
    });
}
