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
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConfig_1 = require("../Configurations/DatabaseConfig");
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const useFileUploader_1 = require("../Hooks/useFileUploader");
const getPostsAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        const posts = yield con.Query(`
      SELECT * FROM posts`, null);
        for (const post of posts) {
            post.user = yield con.QuerySingle(`select * from vw_users where user_pk = @user_pk;`, {
                user_pk: post.encoder_pk,
            });
            post.user.pic = yield useFileUploader_1.GetUploadedImage(post.user.pic);
            post.status = yield con.QuerySingle(`select * from status where sts_pk = @sts_pk;`, {
                sts_pk: post.sts_pk,
            });
            post.files = yield con.Query(`select * from posts_file where posts_pk=@posts_pk`, {
                posts_pk: post.posts_pk,
            });
        }
        con.Commit();
        return {
            success: true,
            data: posts,
        };
    }
    catch (error) {
        console.error(`error`, error);
        con.Rollback();
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getPostReactionsAdmin = (posts_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        const data = yield con.Query(`
       SELECT *,resident_pk as user_pk FROM posts_reaction  WHERE posts_pk=@posts_pk; 
        `, {
            posts_pk: posts_pk,
        });
        con.Commit();
        return {
            success: true,
            data: data,
        };
    }
    catch (error) {
        con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
//ADMIN REACTIONS
const getPostCommentsAdmin = (posts_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        const comments = yield con.Query(`
       SELECT * FROM posts_comment WHERE posts_pk = @posts_pk order by encoded_at desc;
        `, {
            posts_pk: posts_pk,
        });
        for (const comment of comments) {
            comment.user = yield con.QuerySingle(`select * from vw_users where user_pk = @user_pk;`, {
                user_pk: comment.user_pk,
            });
            comment.user.pic = yield useFileUploader_1.GetUploadedImage(comment.user.pic);
        }
        con.Commit();
        return {
            success: true,
            data: comments,
        };
    }
    catch (error) {
        console.error(`error`, error);
        con.Rollback();
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
exports.default = {
    getPostReactionsAdmin,
    getPostCommentsAdmin,
    getPostsAdmin,
};
//# sourceMappingURL=PostsRepository.js.map