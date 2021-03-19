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
const BarangayOfficialRepository_1 = __importDefault(require("../Repositories/BarangayOfficialRepository"));
const BrgyOfficialController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/getBrgyOfficialDataTable", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield BarangayOfficialRepository_1.default.getBrgyOfficialDataTable(payload));
    }));
    router.post("/getBrgyOfficialList", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield BarangayOfficialRepository_1.default.getBrgyOfficialList());
    }));
    router.post("/addBarangayOfficial", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield BarangayOfficialRepository_1.default.addBarangayOfficial(payload, req.user_pk));
    }));
    app.use("/api/official/", router);
});
exports.default = BrgyOfficialController;
//# sourceMappingURL=BrgyOfficialController.js.map