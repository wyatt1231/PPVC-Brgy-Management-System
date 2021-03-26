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
const ComplaintsMobileRepository_1 = __importDefault(require("../Repositories/ComplaintsMobileRepository"));
const ComplaintMobileController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/addComplaintMessage", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.sent_by = req.user_pk;
        res.json(yield ComplaintsMobileRepository_1.default.addComplaintMessage(payload));
    }));
    router.post("/getComplaintMessage", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const complaint_pk = req.body.complaint_pk;
        res.json(yield ComplaintsMobileRepository_1.default.getComplaintMessage(complaint_pk));
    }));
    router.post("/getComplaintList", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const reported_by = req.body.reported_by;
        res.json(yield ComplaintsMobileRepository_1.default.getComplaintList(reported_by));
    }));
    router.post("/addComplaint", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const payload = req.body;
        payload.reported_by = req.user_pk;
        let files = ((_a = req.files) === null || _a === void 0 ? void 0 : _a.uploaded_files) ? (_b = req.files) === null || _b === void 0 ? void 0 : _b.uploaded_files : [];
        res.json(yield ComplaintsMobileRepository_1.default.addComplaint(payload, files instanceof Array ? files : [files]));
    }));
    app.use("/api/complaintmobile/", router);
});
exports.default = ComplaintMobileController;
//# sourceMappingURL=ComplaintsMobileController.js.map