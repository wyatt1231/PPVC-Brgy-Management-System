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
const ComplaintRepository_1 = __importDefault(require("../Repositories/ComplaintRepository"));
const ComplaintController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/addComplaint", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const payload = req.body;
        payload.reported_by = req.user_pk;
        let files = ((_a = req.files) === null || _a === void 0 ? void 0 : _a.uploaded_files) ? (_b = req.files) === null || _b === void 0 ? void 0 : _b.uploaded_files : [];
        res.json(yield ComplaintRepository_1.default.addComplaint(payload, files instanceof Array ? files : [files]));
    }));
    router.post("/updateComplaint", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ComplaintRepository_1.default.updateComplaint(payload));
    }));
    router.post("/getSingleComplaint", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const complaint_pk = req.body.complaint_pk;
        res.json(yield ComplaintRepository_1.default.getSingleComplaint(complaint_pk));
    }));
    router.post("/getComplaintMessage", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const complaint_pk = req.body.complaint_pk;
        res.json(yield ComplaintRepository_1.default.getComplaintMessage(complaint_pk));
    }));
    router.post("/getComplaintTable", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const reported_by = req.body.reported_by;
        res.json(yield ComplaintRepository_1.default.getComplaintTable(reported_by));
    }));
    router.post("/addComplaintLog", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ComplaintRepository_1.default.addComplaintLog(payload, req.user_pk));
    }));
    router.post("/addComplaintMessage", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ComplaintRepository_1.default.addComplaintMessage(payload, req.user_pk));
    }));
    app.use("/api/complaint/", router);
});
exports.default = ComplaintController;
//# sourceMappingURL=ComplaintController.js.map