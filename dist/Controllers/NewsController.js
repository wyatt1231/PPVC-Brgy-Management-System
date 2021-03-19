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
const NewsRepository_1 = __importDefault(require("../Repositories/NewsRepository"));
const NewsController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/getNewsDataTable", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield NewsRepository_1.default.getNewsDataTable());
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/addNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const payload = req.body;
        const files = ((_a = req.files) === null || _a === void 0 ? void 0 : _a.uploaded_files) ? (_b = req.files) === null || _b === void 0 ? void 0 : _b.uploaded_files : [];
        res.json(yield NewsRepository_1.default.addNews(payload, files, req.user_pk));
    }));
    router.post("/updateNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield NewsRepository_1.default.updateNews(payload, req.user_pk));
    }));
    router.post("/republishNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const news_pk = req.body.news_pk;
        res.json(yield NewsRepository_1.default.republishNews(news_pk, req.user_pk));
    }));
    router.post("/unpublishNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const news_pk = req.body.news_pk;
        res.json(yield NewsRepository_1.default.unpublishNews(news_pk, req.user_pk));
    }));
    router.post("/getSingleNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const news_pk = req.body.news_pk;
        res.json(yield NewsRepository_1.default.getSingleNews(news_pk));
    }));
    router.post("/addNewsComment", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield NewsRepository_1.default.addNewsComment(payload, req.user_pk));
    }));
    router.post("/addNewsReaction", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield NewsRepository_1.default.addNewsReaction(payload, req.user_pk));
    }));
    router.post("/updateNewsReaction", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield NewsRepository_1.default.updateNewsReaction(payload, req.user_pk));
    }));
    app.use("/api/news/", router);
});
exports.default = NewsController;
//# sourceMappingURL=NewsController.js.map