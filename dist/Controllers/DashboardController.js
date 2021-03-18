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
const DashboardRepository_1 = __importDefault(require("../Repositories/DashboardRepository"));
const DashboardController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/getYearlyPopulationStats", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield DashboardRepository_1.default.getYearlyPopulationStats());
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/getPopulationOfYearStats", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const current_year = req.body.current_year;
        try {
            res.json(yield DashboardRepository_1.default.getPopulationOfYearStats(current_year));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/getAgeGroupStats", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield DashboardRepository_1.default.getAgeGroupStats());
        }
        catch (error) {
            res.json(error);
        }
    }));
    app.use("/api/dashboard/", router);
});
exports.default = DashboardController;
//# sourceMappingURL=DashboardController.js.map