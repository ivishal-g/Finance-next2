"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var date_fns_1 = require("date-fns");
var prisma_1 = require("@/lib/prisma");
var utils_1 = require("@/lib/utils");
(0, dotenv_1.config)({ path: ".env" });
var SEED_USER_ID = "user_303vsgpORs0UJT30gjItKEwijFf";
var SEED_CATEGORIES = [
    { id: "category_1", name: "Food", userId: SEED_USER_ID, plaidId: null },
    { id: "category_2", name: "Rent", userId: SEED_USER_ID, plaidId: null },
    { id: "category_3", name: "Utitlities", userId: SEED_USER_ID, plaidId: null },
    { id: "category_7", name: "Clothing", userId: SEED_USER_ID, plaidId: null },
];
var SEED_ACCOUNTS = [
    { id: "account_1", name: "Checking", userId: SEED_USER_ID, plaidId: null },
    { id: "account_2", name: "Savings", userId: SEED_USER_ID, plaidId: null },
];
var defaultTo = new Date();
var defaultFrom = (0, date_fns_1.subDays)(defaultTo, 90);
var SEED_TRANSACTIONS = [];
var generateRandomAmount = function (category) {
    switch (category.name) {
        case "Rent":
            return Math.random() * 400 + 90;
        case "Utitlities":
            return Math.random() * 200 + 50;
        case "Food":
            return Math.random() * 30 + 10;
        case "Transportation":
        case "Health":
            return Math.random() * 50 + 15;
        case "Entertainment":
            return Math.random() * 100 + 20;
        case "Clothing":
        case "Miscellaneous":
            return Math.random() * 100 + 20;
        default:
            return Math.random() * 50 + 10;
    }
};
var generateTransactionForDay = function (day) {
    var numTransactions = Math.floor(Math.random() * 4) + 1;
    for (var i = 0; i < numTransactions; i++) {
        var category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
        var isExpense = Math.random() > 0.6;
        var amount = generateRandomAmount(category);
        var formattedAmount = (0, utils_1.convertAmountToMiliunits)(isExpense ? -amount : amount);
        SEED_TRANSACTIONS.push({
            id: "transaction_".concat((0, date_fns_1.format)(day, "yyyy-MM-dd"), "_").concat(i),
            accountId: SEED_ACCOUNTS[0].id,
            categoryId: category.id,
            date: day,
            amount: formattedAmount,
            payee: "Merchant",
            notes: "Random transaction",
        });
    }
};
var generateTransactions = function () {
    var days = (0, date_fns_1.eachDayOfInterval)({ start: defaultFrom, end: defaultTo });
    days.forEach(function (day) { return generateTransactionForDay(day); });
};
generateTransactions();
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, 8, 10]);
                // Delete existing data
                return [4 /*yield*/, prisma_1.prisma.transaction.deleteMany({})];
            case 1:
                // Delete existing data
                _a.sent();
                return [4 /*yield*/, prisma_1.prisma.account.deleteMany({})];
            case 2:
                _a.sent();
                return [4 /*yield*/, prisma_1.prisma.categories.deleteMany({})];
            case 3:
                _a.sent();
                // Insert new data
                return [4 /*yield*/, prisma_1.prisma.categories.createMany({ data: SEED_CATEGORIES })];
            case 4:
                // Insert new data
                _a.sent();
                return [4 /*yield*/, prisma_1.prisma.account.createMany({ data: SEED_ACCOUNTS })];
            case 5:
                _a.sent();
                return [4 /*yield*/, prisma_1.prisma.transaction.createMany({ data: SEED_TRANSACTIONS })];
            case 6:
                _a.sent();
                console.log("🌱 Database seeding completed.");
                return [3 /*break*/, 10];
            case 7:
                error_1 = _a.sent();
                console.error("❌ Error during seed:", error_1);
                process.exit(1);
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, prisma_1.prisma.$disconnect()];
            case 9:
                _a.sent();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
main();
