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
const TutorRepository_1 = __importDefault(require("../Repositories/TutorRepository"));
const TutorController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/getTutorDataTable", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield TutorRepository_1.default.getTutorDataTable(payload));
    }));
    router.post("/addTutor", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield TutorRepository_1.default.addTutor(payload, req.user_id));
    }));
    router.post("/updateTutor", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield TutorRepository_1.default.updateTutor(payload, req.user_id));
    }));
    router.post("/getSingleTutor", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tutor_pk = req.body.tutor_pk;
        res.json(yield TutorRepository_1.default.getSingleTutor(tutor_pk));
    }));
    router.post("/searchTutor", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const search = req.body.value;
        res.json(yield TutorRepository_1.default.searchTutor(search));
    }));
    app.use("/api/tutor/", router);
});
exports.default = TutorController;
//# sourceMappingURL=TutorController.js.map