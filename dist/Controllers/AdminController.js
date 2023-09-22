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
const AdminRepository_1 = __importDefault(require("../Repositories/AdminRepository"));
const AdminController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = (0, express_1.Router)();
    router.post("/getAdminDataTable", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield AdminRepository_1.default.getAdminDataTable(payload));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/addAdmin", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield AdminRepository_1.default.addAdmin(payload, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/updateAdmin", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield AdminRepository_1.default.updateAdmin(payload, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/changeAdminStatus", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            payload.encoder_pk = req.user_pk;
            res.json(yield AdminRepository_1.default.changeAdminStatus(payload));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/getSingleAdmin", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const admin_pk = req.body.admin_pk;
            res.json(yield AdminRepository_1.default.getSingleAdmin(admin_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    app.use("/api/admin/", router);
});
exports.default = AdminController;
//# sourceMappingURL=AdminController.js.map