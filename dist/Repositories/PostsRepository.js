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
const useDateParser_1 = require("../Hooks/useDateParser");
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const useFileUploader_1 = require("../Hooks/useFileUploader");
const getPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
        SELECT * FROM 
      (SELECT p.posts_pk,p.title,p.body,p.sts_pk,CASE WHEN DATE_FORMAT(p.encoded_at,'%d')= DATE_FORMAT(CURDATE(),'%d') THEN CONCAT("Today at ",DATE_FORMAT(p.encoded_at,'%h:%m %p')) WHEN DATEDIFF(NOW(),p.encoded_at) >7 THEN DATE_FORMAT(p.encoded_at,'%b/%d %h:%m %p') WHEN DATEDIFF(NOW(),p.encoded_at) <=7 THEN  CONCAT(DATEDIFF(NOW(),p.encoded_at),'D')  ELSE DATE_FORMAT(p.encoded_at,'%b/%d %h:%m') END AS TIMESTAMP,p.encoder_pk , s.sts_desc,s.sts_color,s.sts_backgroundColor
        ,u.full_name user_full_name,u.pic user_pic,COUNT( pr.reaction)likes FROM posts p
        LEFT JOIN status s ON p.sts_pk = s.sts_pk 
        LEFT JOIN posts_reaction pr ON pr.posts_pk=p.posts_pk
        LEFT JOIN vw_users u ON u.user_pk = p.encoder_pk WHERE p.sts_pk="PU" GROUP BY p.posts_pk ORDER BY p.encoded_at DESC)tmp;
        `, null);
        for (const file of data) {
            const sql_get_pic = yield con.QuerySingle(`SELECT pic FROM resident WHERE user_pk=${file === null || file === void 0 ? void 0 : file.encoder_pk} LIMIT 1`, null);
            if (!!(file === null || file === void 0 ? void 0 : file.user_pic)) {
                file.user_pic = yield (0, useFileUploader_1.GetUploadedImage)(file.user_pic);
            }
        }
        for (const file of data) {
            file.upload_files = yield con.Query(`
        select * from posts_file where posts_pk=@posts_pk
        `, {
                posts_pk: file.posts_pk,
            });
        }
        con.Commit();
        return {
            success: true,
            data: data,
        };
    }
    catch (error) {
        yield con.Rollback();
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getPostsAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        const posts = yield con.QueryPagination(`
      select * from (SELECT p.*, u.full_name FROM posts p join vw_users u on u.user_pk = p.encoder_pk) as tmp
      WHERE
      (coalesce(full_name,'')  like concat('%',@search,'%')
      OR coalesce(title,'') like concat('%',@search,'%'))
      AND sts_pk in @sts_pk
      AND encoded_at >= ${(0, useDateParser_1.sqlFilterDate)(payload.filters.date_from, "encoded_at")}
      AND encoded_at <= ${(0, useDateParser_1.sqlFilterDate)(payload.filters.date_to, "encoded_at")}
      `, payload);
        const hasMore = posts.length > payload.page.limit;
        if (hasMore) {
            posts.splice(posts.length - 1, 1);
        }
        for (const post of posts) {
            post.user = yield con.QuerySingle(`select * from vw_users where user_pk = @user_pk;`, {
                user_pk: post.encoder_pk,
            });
            if (!!((_a = post === null || post === void 0 ? void 0 : post.user) === null || _a === void 0 ? void 0 : _a.pic)) {
                post.user.pic = yield (0, useFileUploader_1.GetUploadedImage)(post.user.pic);
            }
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
            data: {
                table: posts,
                has_more: hasMore,
            },
        };
    }
    catch (error) {
        console.error(`error`, error);
        con.Rollback();
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getUserPosts = (user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
        SELECT * FROM 
      (SELECT p.posts_pk,p.title,p.body,p.sts_pk,CASE WHEN DATE_FORMAT(p.encoded_at,'%d')= DATE_FORMAT(CURDATE(),'%d') THEN CONCAT("Today at ",DATE_FORMAT(p.encoded_at,'%h:%m %p')) WHEN DATEDIFF(NOW(),p.encoded_at) >7 THEN DATE_FORMAT(p.encoded_at,'%b/%d %h:%m %p') WHEN DATEDIFF(NOW(),p.encoded_at) <=7 THEN  CONCAT(DATEDIFF(NOW(),p.encoded_at),'D')  ELSE DATE_FORMAT(p.encoded_at,'%b/%d %h:%m') END AS TIMESTAMP,p.encoder_pk , s.sts_desc,s.sts_color,s.sts_backgroundColor
        ,u.full_name user_full_name,u.pic user_pic,COUNT( pr.reaction)likes FROM posts p
        LEFT JOIN status s ON p.sts_pk = s.sts_pk 
        LEFT JOIN posts_reaction pr ON pr.posts_pk=p.posts_pk
        LEFT JOIN vw_users u ON u.user_pk = p.encoder_pk WHERE p.sts_pk="PU" AND u.user_pk=@user_pk GROUP BY p.posts_pk ORDER BY p.encoded_at DESC)tmp;
        `, {
            user_pk,
        });
        for (const file of data) {
            const sql_get_pic = yield con.QuerySingle(`SELECT pic FROM resident WHERE user_pk=${file === null || file === void 0 ? void 0 : file.encoder_pk} LIMIT 1`, null);
            if (!!(file === null || file === void 0 ? void 0 : file.user_pic)) {
                file.user_pic = yield (0, useFileUploader_1.GetUploadedImage)(file.user_pic);
            }
        }
        for (const file of data) {
            file.upload_files = yield con.Query(`
        select * from posts_file where posts_pk=@posts_pk
        `, {
                posts_pk: file.posts_pk,
            });
        }
        con.Commit();
        return {
            success: true,
            data: data,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getPostsReaction = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
          SELECT CASE WHEN reaction="Like" THEN CASE WHEN COUNT(reaction) IS NULL THEN 0 ELSE COUNT(reaction)END END AS likereaction FROM posts_reaction
          `, null);
        con.Commit();
        return {
            success: true,
            data: data,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getPostsComments = (posts_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`SELECT u.user_pk,pw.posts_comment_pk,pic,CONCAT(first_name,' ',middle_name,'. ',last_name) AS fullname,pw.body,CASE WHEN DATE_FORMAT(pw.encoded_at,'%d')= DATE_FORMAT(CURDATE(),'%d') THEN CONCAT("Today at ",DATE_FORMAT(pw.encoded_at,'%h:%m %p')) ELSE DATE_FORMAT(pw.encoded_at,'%m-%d-%y %h:%m') END AS TIMESTAMP  FROM posts_comment pw JOIN resident u ON pw.user_pk=u.user_pk  where posts_pk=@posts_pk`, {
            posts_pk: posts_pk,
        });
        for (const file of data) {
            const sql_get_pic = yield con.QuerySingle(`SELECT pic FROM resident WHERE user_pk=${file === null || file === void 0 ? void 0 : file.user_pk} LIMIT 1`, null);
            if (!!(file === null || file === void 0 ? void 0 : file.user_pic)) {
                file.user_pic = yield (0, useFileUploader_1.GetUploadedImage)(file.user_pic);
            }
        }
        con.Commit();
        return {
            success: true,
            data: data,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const addPosts = (payload, files, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        payload.encoder_pk = user_pk;
        const sql_add_posts = yield con.Insert(`INSERT INTO posts SET
         title=@title,
         body=@body,
         sts_pk="PU",
         encoder_pk=@encoder_pk;`, payload);
        if (sql_add_posts.insertedId > 0) {
            for (const file of files) {
                const file_res = yield (0, useFileUploader_1.UploadFile)("src/Storage/Files/Posts/", file);
                if (!file_res.success) {
                    con.Rollback();
                    return file_res;
                }
                const posts_file_payload = {
                    file_path: file_res.data.path,
                    file_name: file_res.data.name,
                    mimetype: file_res.data.mimetype,
                    encoder_pk: user_pk,
                    posts_pk: sql_add_posts.insertedId,
                };
                const sql_add_posts_file = yield con.Insert(`INSERT INTO posts_file SET
             posts_pk=@posts_pk,
             file_path=@file_path,
             file_name=@file_name,
             mimetype=@mimetype,
             encoder_pk=@encoder_pk;`, posts_file_payload);
                if (sql_add_posts_file.affectedRows < 1) {
                    con.Rollback();
                    return {
                        success: false,
                        message: "The process has been terminated when trying to save the file!",
                    };
                }
            }
            con.Commit();
            return {
                success: true,
                message: "The news has been published successfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "No affected rows while creating the news",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const addPostComment = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        payload.user_pk = user_pk;
        const sql_add_post_comment = yield con.Insert(`INSERT INTO posts_comment SET
      posts_pk=@posts_pk,
      user_pk=@user_pk,
      body=@body;`, payload);
        if (sql_add_post_comment.insertedId > 0) {
            con.Commit();
            return {
                success: true,
                message: "Your reaction has beed added!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "Looks like something went wrong, unable to save your reaction!",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const addPostReaction = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        payload.user_pk = user_pk;
        const sql_check_exist = yield con.Query(`SELECT * FROM posts_reaction WHERE posts_pk=@posts_pk AND resident_pk=@user_pk`, payload);
        if (sql_check_exist.toString() == "") {
            const sql_add_news_reaction = yield con.Modify(`INSERT INTO posts_reaction SET
          posts_pk=@posts_pk,
          reaction=@reaction,
          resident_pk=@user_pk;`, payload);
            if (sql_add_news_reaction > 0) {
                con.Commit();
                return {
                    success: true,
                    message: "Your reaction has beed added!",
                };
            }
            else {
                con.Rollback();
                return {
                    success: false,
                    message: "Looks like something went wrong, unable to save your reaction!",
                };
            }
        }
        else {
            const sql_update_news_reaction = yield con.Modify(`update  posts_reaction SET
          reaction=@reaction
          where posts_pk=@posts_pk 
          and
          resident_pk=@user_pk;`, payload);
            if (sql_update_news_reaction > 0) {
                con.Commit();
                return {
                    success: true,
                    message: "Your reaction has beed updated!",
                };
            }
            else {
                con.Rollback();
                return {
                    success: false,
                    message: "2 Looks like something went wrong, unable to save your reaction!",
                };
            }
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
//ADMIN POSTS
const getPostReactionsAdmin = (posts_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
//ADMIN REACTIONS
const getPostCommentsAdmin = (posts_pk) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
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
            if (!!((_b = comment === null || comment === void 0 ? void 0 : comment.user) === null || _b === void 0 ? void 0 : _b.pic)) {
                comment.user.pic = yield (0, useFileUploader_1.GetUploadedImage)(comment.user.pic);
            }
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const updatePostStatus = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const sql_update_post = yield con.Modify(`UPDATE posts SET
      sts_pk=@sts_pk
      WHERE posts_pk=@posts_pk;
      `, payload);
        if (sql_update_post > 0) {
            con.Commit();
            return {
                success: true,
                message: "The post status has been changes successfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "Looks like something went wrong, unable to save your reaction!",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
exports.default = {
    addPosts,
    getPosts,
    getUserPosts,
    addPostReaction,
    addPostComment,
    getPostsReaction,
    getPostsComments,
    getPostReactionsAdmin,
    getPostCommentsAdmin,
    getPostsAdmin,
    updatePostStatus,
};
//# sourceMappingURL=PostsRepository.js.map