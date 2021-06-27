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
const ResidentRepository_1 = __importDefault(require("../Repositories/ResidentRepository"));
const ResidentController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/getDataTableResident", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield ResidentRepository_1.default.getDataTableResident(payload));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/getDataTableResidentPdf", 
    // Authorize("admin,resident"),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield ResidentRepository_1.default.getDataTableResidentPdf(payload));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/addResident", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield ResidentRepository_1.default.addResident(payload, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/updateResident", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield ResidentRepository_1.default.updateResident(payload, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/toggleResidentStatus", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const resident_pk = req.body.resident_pk;
            res.json(yield ResidentRepository_1.default.toggleResidentStatus(resident_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/getSingleResident", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const resident_pk = req.body.resident_pk;
            res.json(yield ResidentRepository_1.default.getSingleResident(resident_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/searchResident", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const search = req.body.value;
            res.json(yield ResidentRepository_1.default.searchResident(search));
        }
        catch (error) {
            res.json(500);
        }
    }));
    app.use("/api/resident/", router);
});
exports.default = ResidentController;
//# sourceMappingURL=ResidentController.js.map