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
    router.post("/getNewsComments", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const news_pk = req.body.news_pk;
            res.json(yield NewsRepository_1.default.getNewsComments(news_pk));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/getNewsDataTable", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield NewsRepository_1.default.getNewsDataTable(payload));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/getNewsFiles", Authorize_1.default(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body.news_pk;
            res.json(yield NewsRepository_1.default.getNewsFiles(payload));
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/getNewsDataPublished", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield NewsRepository_1.default.getNewsDataPublished());
        }
        catch (error) {
            res.json(error);
        }
    }));
    router.post("/addNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const payload = req.body;
            let files = ((_a = req.files) === null || _a === void 0 ? void 0 : _a.uploaded_files) ? (_b = req.files) === null || _b === void 0 ? void 0 : _b.uploaded_files : [];
            if (files instanceof Array) {
            }
            else {
                files = [files];
            }
            res.json(yield NewsRepository_1.default.addNews(payload, files instanceof Array ? files : [files], req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/addNewsFiles", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        try {
            const payload = req.body;
            let files = ((_c = req.files) === null || _c === void 0 ? void 0 : _c.uploaded_files) ? (_d = req.files) === null || _d === void 0 ? void 0 : _d.uploaded_files : [];
            if (files instanceof Array) {
            }
            else {
                files = [files];
            }
            res.json(yield NewsRepository_1.default.addNewsFiles(payload, files instanceof Array ? files : [files], req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/updateNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield NewsRepository_1.default.updateNews(payload, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/republishNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const news_pk = req.body.news_pk;
            res.json(yield NewsRepository_1.default.republishNews(news_pk, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/unpublishNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const news_pk = req.body.news_pk;
            res.json(yield NewsRepository_1.default.unpublishNews(news_pk, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/getSingleNews", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const news_pk = req.body.news_pk;
            res.json(yield NewsRepository_1.default.getSingleNews(news_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/getSingleNewsWithPhoto", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const news_pk = req.body.news_pk;
            res.json(yield NewsRepository_1.default.getSingleNewsWithPhoto(news_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/addNewsComment", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield NewsRepository_1.default.addNewsComment(payload, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/addNewsReaction", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield NewsRepository_1.default.addNewsReaction(payload, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/toggleLike", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = Object.assign(Object.assign({}, req.body), { liked_by: req.user_pk });
            res.json(yield NewsRepository_1.default.toggleLike(payload));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/updateNewsReaction", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield NewsRepository_1.default.updateNewsReaction(payload, req.user_pk));
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/getNewsLatest", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json(yield NewsRepository_1.default.getNewsLatest());
        }
        catch (error) {
            res.json(500);
        }
    }));
    router.post("/deleteNewsFile", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            res.json(yield NewsRepository_1.default.deleteNewsFile(payload));
        }
        catch (error) {
            res.json(500);
        }
    }));
    app.use("/api/news/", router);
});
exports.default = NewsController;
//# sourceMappingURL=NewsController.js.map