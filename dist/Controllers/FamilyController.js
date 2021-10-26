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
const FamilyRepository_1 = __importDefault(require("../Repositories/FamilyRepository"));
const FamilyController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = (0, express_1.Router)();
    router.post("/addFamily", (0, Authorize_1.default)("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            payload.encoded_by = req.user_pk;
            res.json(yield FamilyRepository_1.default.addFamily(payload, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/updateFamily", (0, Authorize_1.default)("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            payload.encoded_by = req.user_pk;
            res.json(yield FamilyRepository_1.default.updateFamily(payload, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/getSingleFamily", (0, Authorize_1.default)("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ulo_pamilya = req.body.ulo_pamilya;
            res.json(yield FamilyRepository_1.default.getSingleFamily(ulo_pamilya));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/getSingleFamByFamPk", (0, Authorize_1.default)("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fam_pk = req.body.fam_pk;
            res.json(yield FamilyRepository_1.default.getSingleFamByFamPk(fam_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/getFamilyOfResident", (0, Authorize_1.default)("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const resident_pk = req.body.resident_pk;
            res.json(yield FamilyRepository_1.default.getFamilyOfResident(resident_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/getFamilyDataTable", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield FamilyRepository_1.default.getFamilyDataTable(payload));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/getFamilyDataTablePdf", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield FamilyRepository_1.default.getFamilyDataTablePdf(payload));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/searchNoFamResident", (0, Authorize_1.default)("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            res.json(500);
        }
        const search = req.body.value;
        res.json(yield FamilyRepository_1.default.searchNoFamResident(search));
    }));
    router.post("/searchFamMember", (0, Authorize_1.default)("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            res.json(500);
        }
        const payload = req.body;
        res.json(yield FamilyRepository_1.default.searchFamMember(payload));
    }));
    app.use("/api/family/", router);
});
exports.default = FamilyController;
//# sourceMappingURL=FamilyController.js.map