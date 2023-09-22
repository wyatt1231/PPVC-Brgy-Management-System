"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authorize_1 = __importDefault(require("../Middlewares/Authorize"));
const user_repo = __importStar(require("../Repositories/UserRepository"));
const UserController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = (0, express_1.Router)();
    router.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json("Running");
    }));
    router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield user_repo.loginUser(req.body);
            console.log(`response`, response);
            res.json(response);
        }
        catch (error) {
            console.error(`e`, error);
            res.json(500);
        }
    }));
    router.post("/currentUser", (0, Authorize_1.default)("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield user_repo.currentUser(req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/userinfo", (0, Authorize_1.default)("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield user_repo.userinfo(req.user_pk);
            console.log(`userinfo response`, response);
            res.json(response);
        }
        catch (error) {
            //marktabang@gmail.com
            console.error(`userinfo`, error);
            res.json(500);
        }
    }));
    app.use("/api/user/", router);
});
exports.default = UserController;
//# sourceMappingURL=UserController.js.map