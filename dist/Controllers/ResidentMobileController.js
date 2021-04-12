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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authorize_1 = __importDefault(require("../Middlewares/Authorize"));
const ResidentMobileRepository_1 = __importDefault(require("../Repositories/ResidentMobileRepository"));
const ResidentMobileController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/addMobileResident", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ResidentMobileRepository_1.default.addMobileResident(payload));
    }));
    router.post("/getresidents", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const search = req.body.search;
        res.json(yield ResidentMobileRepository_1.default.getresidents(search));
    }));
    router.post("/upadatenewuser", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user_pk = req.body.user_pk;
        res.json(yield ResidentMobileRepository_1.default.upadatenewuser(user_pk));
    }));
    app.use("/api/residentmobile/", router);
});
exports.default = ResidentMobileController;
//# sourceMappingURL=ResidentMobileController.js.map