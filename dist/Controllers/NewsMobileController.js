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
const NewsMobileRepository_1 = __importDefault(require("../Repositories/NewsMobileRepository"));
const NewsMobileController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/getNewsComments", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const news_pk = req.body.news_pk;
            res.json(yield NewsMobileRepository_1.default.getNewsComments(news_pk));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/getNewsDataPublished", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield NewsMobileRepository_1.default.getNewsDataPublished());
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/getNewsDataPublishedLastWeek", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield NewsMobileRepository_1.default.getNewsDataPublishedLastWeek());
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/getNewsDataPublishedByMonth", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const month = req.body.month;
        try {
            res.json(yield NewsMobileRepository_1.default.getNewsDataPublishedByMonth(month));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/getSingleNewsWithPhoto", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const news_pk = req.body.news_pk;
        res.json(yield NewsMobileRepository_1.default.getSingleNewsWithPhoto(news_pk));
    }));
    router.post("/addNewsComment", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield NewsMobileRepository_1.default.addNewsComment(payload, req.user_pk));
    }));
    router.post("/addNewsReaction", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield NewsMobileRepository_1.default.addNewsReaction(payload, req.user_pk));
    }));
    router.post("/addNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const payload = req.body;
        let files = ((_a = req.files) === null || _a === void 0 ? void 0 : _a.uploaded_files) ? (_b = req.files) === null || _b === void 0 ? void 0 : _b.uploaded_files : [];
        if (files instanceof Array) {
        }
        else {
            files = [files];
        }
        res.json(yield NewsMobileRepository_1.default.addNews(payload, files instanceof Array ? files : [files], req.user_pk));
    }));
    app.use("/api/newsmobile/", router);
});
exports.default = NewsMobileController;
//# sourceMappingURL=NewsMobileController.js.map