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
    router.post("/overallPopulation", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const purok = req.body;
            res.json(yield DashboardRepository_1.default.overallPopulation(purok));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/ageGroupStats", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const purok = req.body;
        try {
            res.json(yield DashboardRepository_1.default.ageGroupStats(purok));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/genderStats", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const purok = req.body;
            res.json(yield DashboardRepository_1.default.genderStats(purok));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/lifeStageStats", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const purok = req.body;
            res.json(yield DashboardRepository_1.default.lifeStageStats(purok));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/statsComplaint", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield DashboardRepository_1.default.statsComplaint());
    }));
    router.post("/statsNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield DashboardRepository_1.default.statsNews());
    }));
    app.use("/api/dashboard/", router);
});
exports.default = DashboardController;
//# sourceMappingURL=DashboardController.js.map