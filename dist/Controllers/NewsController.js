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
const axios_1 = __importDefault(require("axios"));
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
        const payload = req.body;
        let files = ((_a = req.files) === null || _a === void 0 ? void 0 : _a.uploaded_files) ? (_b = req.files) === null || _b === void 0 ? void 0 : _b.uploaded_files : [];
        if (files instanceof Array) {
        }
        else {
            files = [files];
        }
        res.json(yield NewsRepository_1.default.addNews(payload, files instanceof Array ? files : [files], req.user_pk));
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
    router.post("/getSingleNewsWithPhoto", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const news_pk = req.body.news_pk;
        res.json(yield NewsRepository_1.default.getSingleNewsWithPhoto(news_pk));
    }));
    router.post("/addNewsComment", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield NewsRepository_1.default.addNewsComment(payload, req.user_pk));
    }));
    router.post("/addNewsReaction", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield NewsRepository_1.default.addNewsReaction(payload, req.user_pk));
    }));
    router.post("/toggleLike", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = Object.assign(Object.assign({}, req.body), { liked_by: req.user_pk });
        res.json(yield NewsRepository_1.default.toggleLike(payload));
    }));
    router.post("/updateNewsReaction", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield NewsRepository_1.default.updateNewsReaction(payload, req.user_pk));
    }));
    router.post("/getNewsLatest", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield NewsRepository_1.default.getNewsLatest());
    }));
    router.get("/testSms", 
    // Authorize("admin"),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`-------------------`);
        try {
            const response = yield axios_1.default.post(`https://www.itexmo.com/php_api/api.php`, {
                to: "09517359838",
                text: "Hi, i like you!",
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: `application/json`,
                    // Accept: "application/json",
                    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMGIzYWUzZGJkZWQ3NGNjNDRlZmE5OTM2YTMxNGMwNjUzY2YwMGFiMmUxZGEzMjA3Njk4NjFhYTgxOGYyODQ0YTRmYzI4NWIzMzgxNDJmM2EiLCJpYXQiOjE2MTg2Njk4ODgsIm5iZiI6MTYxODY2OTg4OCwiZXhwIjoxNjUwMjA1ODg4LCJzdWIiOiIxMzM0NyIsInNjb3BlcyI6W119.Crat1LuK-Y2ZUZ5x4tD2o_MNUByQv260TEihb3Uw2Hpi7GtD7RLhxgPsCUggIpu9BtKoxe69oyZaOCSmjPdT5l7d42p9bTbz-9QBCjwWJ5hzlv-47bZS1UTe9kmZOVhZWY0MJGDcrILaFJhliIRN4cocV4sonOhdgpSlqoHk27fOt0I1k5ElLkMomOGusatOEXBTKh04--Kc4f8ClX9-XW9yjlmxbrhx2Td9c4Uv-gvMiSyVEHF_jnPxtQTluXoervCfLRwhxLbPvOIGEp3Jm_M6lssgcMGzGJcex1IV0qWdF7XoUU5Qk7Hn1VrhACCDmK6vA14kvz8n1tbMKIJhhj5uiIvke_xrtYIlxUI_HQlC2pjHHnNsEcQ6OkHGD-v8Ik37Bcp4r6gYX4WUgta-zDx8Ycr8pwt04IYD7MslvOtRLlLwcWotDDQAiExqNuNIjHMScCWfhM8vn9KdwUsZx3HAJ0bRn__n8ecxOD-0OMxA929gtIXs_oNTqAfiC8w0huJ6O_73-qstoQKBL88gs8BbXPf4VAvDxdvXjsCbWXxVqARJb0gCTzdqqjive2CfDXov5_uBsYO9ctqXiHWRbnS_9ljQVao_vcUAhzheQSn0aDpb4okXMXUXr1gik_3DkOKTuhCKayTuXVzdWtcSLIR6lPjkYFvWFJN9D0W2e7w`,
                },
            });
            res.json(response);
        }
        catch (error) {
            console.log(`error`, error);
            res.json(error);
        }
    }));
    app.use("/api/news/", router);
});
exports.default = NewsController;
//# sourceMappingURL=NewsController.js.map