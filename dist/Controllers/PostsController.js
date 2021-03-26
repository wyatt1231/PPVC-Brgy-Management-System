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
const PostsRepository_1 = __importDefault(require("../Repositories/PostsRepository"));
const PostsController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    //reactions
    router.post("/getPostReactionsAdmin", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const posts_pk = req.body.posts_pk;
        res.json(yield PostsRepository_1.default.getPostReactionsAdmin(posts_pk));
    }));
    //comments
    router.post("/getPostCommentsAdmin", Authorize_1.default("admin,resident"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const posts_pk = req.body.posts_pk;
        res.json(yield PostsRepository_1.default.getPostCommentsAdmin(posts_pk));
    }));
    app.use("/api/posts/", router);
});
exports.default = PostsController;
//# sourceMappingURL=PostsController.js.map