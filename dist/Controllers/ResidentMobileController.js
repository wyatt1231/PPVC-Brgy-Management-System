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
const ResidentMobileRepository_1 = __importDefault(require("../Repositories/ResidentMobileRepository"));
const ResidentMobileController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/addMobileResident", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ResidentMobileRepository_1.default.addMobileResident(payload));
    }));
    router.post("/updateMobileResident", 
    // Authorize("admin,resident"),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const user_pk = req.body.user_pk;
        res.json(yield ResidentMobileRepository_1.default.updateMobileResident(payload, user_pk));
    }));
    router.post("/getresidents", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const search = req.body.search;
        res.json(yield ResidentMobileRepository_1.default.getresidents(search));
    }));
    router.post("/getmembers", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const resident_pk = req.body.resident_pk;
        res.json(yield ResidentMobileRepository_1.default.getmembers(resident_pk));
    }));
    router.post("/getmembers_ulosapamilya", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const fam_pk = req.body.fam_pk;
        res.json(yield ResidentMobileRepository_1.default.getmembers_ulosapamilya(fam_pk));
    }));
    router.post("/getreligion", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield ResidentMobileRepository_1.default.getreligion());
    }));
    router.post("/getnationality", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield ResidentMobileRepository_1.default.getnationality());
    }));
    router.post("/upadatenewuser", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user_pk = req.body.user_pk;
        res.json(yield ResidentMobileRepository_1.default.upadatenewuser(user_pk));
    }));
    router.post("/updatepassword", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        const currentpassword = req.body.currentpassword;
        res.json(yield ResidentMobileRepository_1.default.updatepassword(email, password, currentpassword));
    }));
    router.post("/forgotpassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        res.json(yield ResidentMobileRepository_1.default.forgotpassword(email, password));
    }));
    app.use("/api/residentmobile/", router);
});
exports.default = ResidentMobileController;
//# sourceMappingURL=ResidentMobileController.js.map