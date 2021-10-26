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
    const router = (0, express_1.Router)();
    router.post("/overallPopulation", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const purok = req.body;
            res.json(yield DashboardRepository_1.default.overallPopulation(purok));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/ageGroupStats", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const purok = req.body;
        try {
            res.json(yield DashboardRepository_1.default.ageGroupStats(purok));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/genderStats", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const purok = req.body;
            res.json(yield DashboardRepository_1.default.genderStats(purok));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/lifeStageStats", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const purok = req.body;
            res.json(yield DashboardRepository_1.default.lifeStageStats(purok));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/statsComplaint", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield DashboardRepository_1.default.statsComplaint());
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/statsNews", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield DashboardRepository_1.default.statsNews());
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/total_population", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const purok = req.body;
            res.json(yield DashboardRepository_1.default.total_population(purok));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/total_death", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const purok = req.body;
            res.json(yield DashboardRepository_1.default.total_death(purok));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/total_pwd", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const purok = req.body;
            res.json(yield DashboardRepository_1.default.total_pwd(purok));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/total_sc", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const purok = req.body;
            res.json(yield DashboardRepository_1.default.total_sc(purok));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/StatsPasilidadKuryente", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield DashboardRepository_1.default.StatsPasilidadKuryente());
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/StatsBiktikmaPangabuso", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield DashboardRepository_1.default.StatsBiktikmaPangabuso());
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/StatsKahimtangKomunidad", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield DashboardRepository_1.default.StatsKahimtangKomunidad());
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/StatsMatangBasura", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield DashboardRepository_1.default.StatsMatangBasura());
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/StatsMatangKasilyas", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield DashboardRepository_1.default.StatsMatangKasilyas());
        }
        catch (error) {
            res.json(500);
        }
    }));
    app.use("/api/dashboard/", router);
});
exports.default = DashboardController;
//# sourceMappingURL=DashboardController.js.map