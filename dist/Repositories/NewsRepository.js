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
const getNewsComments = (news_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`SELECT u.user_pk,nw.news_comment_pk,pic,CONCAT(first_name,' ',middle_name,'. ',last_name) AS fullname,nw.body,CASE WHEN DATE_FORMAT(nw.encoded_at,'%d')= DATE_FORMAT(CURDATE(),'%d') THEN CONCAT("Today at ",DATE_FORMAT(nw.encoded_at,'%h:%m %p')) ELSE DATE_FORMAT(nw.encoded_at,'%m-%d-%y %h:%m') END AS TIMESTAMP  FROM news_comment nw JOIN resident u ON nw.user_pk=u.user_pk  where news_pk=@news_pk`, {
            news_pk: news_pk,
        });
        for (const file of data) {
            const sql_get_pic = yield con.QuerySingle(`SELECT pic FROM resident WHERE user_pk=${file === null || file === void 0 ? void 0 : file.user_pk} LIMIT 1`, null);
            file.user_pic = yield useFileUploader_1.GetUploadedImage(sql_get_pic === null || sql_get_pic === void 0 ? void 0 : sql_get_pic.pic);
            console.error(`error`, file.user_pk);
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
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getSingleNewsWithPhoto = (news_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
      SELECT * FROM 
      (
        SELECT n.*, s.sts_desc,s.sts_color,s.sts_backgroundColor
        ,u.full_name user_full_name,u.pic user_pic FROM news n 
        LEFT JOIN status s ON n.sts_pk = s.sts_pk 
        LEFT JOIN vw_users u ON u.user_pk = n.encoder_pk WHERE n.news_pk=@news_pk order by n.encoded_at desc) tmp;
      `, {
            news_pk: news_pk,
        });
        for (const file of data) {
            file.upload_files = yield con.Query(`
      select * from news_file where news_pk=@news_pk
      `, {
                news_pk: file.news_pk,
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
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getNewsDataPublished = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const news_table = yield con.Query(`
      SELECT * FROM 
      (
        SELECT n.news_pk,n.title,n.body,n.sts_pk,CASE WHEN DATE_FORMAT(n.encoded_at,'%d')= DATE_FORMAT(CURDATE(),'%d') THEN CONCAT("Today at ",DATE_FORMAT(n.encoded_at,'%h:%m %p')) WHEN DATEDIFF(NOW(),n.encoded_at) >7 THEN DATE_FORMAT(n.encoded_at,'%b/%d %h:%m %p') WHEN DATEDIFF(NOW(),n.encoded_at) <=7 THEN  CONCAT(DATEDIFF(NOW(),n.encoded_at),'D')  ELSE DATE_FORMAT(n.encoded_at,'%b/%d %h:%m') END AS TIMESTAMP,n.encoder_pk , s.sts_desc,s.sts_color,s.sts_backgroundColor
        ,u.full_name user_full_name,u.pic user_pic,COUNT( nr.reaction)likes FROM news n 
        LEFT JOIN status s ON n.sts_pk = s.sts_pk 
          LEFT JOIN news_reaction nr ON nr.news_pk=n.news_pk
        LEFT JOIN vw_users u ON u.user_pk = n.encoder_pk WHERE n.sts_pk="PU" GROUP BY n.news_pk ORDER BY n.encoded_at DESC) tmp;
      `, null);
        for (const news of news_table) {
            news.upload_files = yield con.Query(`
      select * from news_file where news_pk=@news_pk
      `, {
                news_pk: news.news_pk,
            });
            news.comments = yield con.Query(`
        SELECT nc.*,u.pic,u.full_name FROM news_comment nc LEFT JOIN vw_users u
        ON nc.user_pk = u.user_pk WHERE nc.news_pk = @news_pk
        `, {
                news_pk: news.news_pk,
            });
        }
        con.Commit();
        return {
            success: true,
            data: news_table,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getNewsDataTable = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        console.log(`payload`, payload);
        const news_table = yield con.QueryPagination(`
      SELECT * FROM news WHERE
      title like concat('%',@search,'%')
      AND sts_pk in @sts_pk
      AND encoded_at >= ${useDateParser_1.sqlFilterDate(payload.filters.date_from, "encoded_at")}
      AND encoded_at <= ${useDateParser_1.sqlFilterDate(payload.filters.date_to, "encoded_at")}
      `, payload);
        // console.log(`news_table`, news_table);
        for (const news of news_table) {
            news.status = yield con.QuerySingle(`select * from status where sts_pk=@sts_pk`, {
                sts_pk: news.sts_pk,
            });
            news.user = yield con.QuerySingle(`select * from vw_users where user_pk=@user_pk`, {
                user_pk: news.encoder_pk,
            });
            if ((_a = news === null || news === void 0 ? void 0 : news.user) === null || _a === void 0 ? void 0 : _a.pic) {
                news.user.pic = yield useFileUploader_1.GetUploadedImage((_b = news === null || news === void 0 ? void 0 : news.user) === null || _b === void 0 ? void 0 : _b.pic);
            }
        }
        con.Commit();
        return {
            success: true,
            data: news_table,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getNewsFiles = (news_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const files_table = yield con.Query(`
      SELECT * FROM news_file where news_pk =@news_pk; 
      `, {
            news_pk: news_pk,
        });
        con.Commit();
        return {
            success: true,
            data: files_table,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const addNews = (payload, files, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.encoder_pk = user_pk;
        payload.pub_date = useDateParser_1.parseInvalidDateToDefault(payload.pub_date, "(NULL)");
        payload.is_prio =
            payload.is_prio === true || payload.is_prio === "true" ? 1 : 0;
        console.log(`add payload`, payload);
        const sql_add_news = yield con.Insert(`INSERT INTO news SET
         title=@title,
         audience=@audience,
         body=@body,
         pub_date=@pub_date,
         is_prio=@is_prio,
         encoder_pk=@encoder_pk;`, payload);
        if (sql_add_news.insertedId > 0) {
            for (const file of files) {
                const file_res = yield useFileUploader_1.UploadFile("src/Storage/Files/News/", file);
                if (!file_res.success) {
                    con.Rollback();
                    return file_res;
                }
                const news_file_payload = {
                    file_path: file_res.data.path,
                    file_name: file_res.data.name,
                    mimetype: file_res.data.mimetype,
                    encoder_pk: user_pk,
                    news_pk: sql_add_news.insertedId,
                };
                const sql_add_news_file = yield con.Insert(`INSERT INTO news_file SET
             news_pk=@news_pk,
             file_path=@file_path,
             file_name=@file_name,
             mimetype=@mimetype,
             encoder_pk=@encoder_pk;`, news_file_payload);
                if (sql_add_news_file.affectedRows < 1) {
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
        // console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const republishNews = (news_pk, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_republish_news = yield con.Modify(`UPDATE news SET
       sts_pk='PU'
       where news_pk=@news_pk;`, {
            news_pk: news_pk,
        });
        if (sql_republish_news > 0) {
            con.Commit();
            return {
                success: true,
                message: "The news has been republished successfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "No affected rows while updating the news",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const unpublishNews = (news_pk, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_republish_news = yield con.Modify(`UPDATE news SET
       sts_pk='UP'
       where news_pk=@news_pk;`, {
            news_pk: news_pk,
        });
        if (sql_republish_news > 0) {
            con.Commit();
            return {
                success: true,
                message: "The news has been unpublished!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "No affected rows while updating the news",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const updateNews = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.encoder_pk = user_pk;
        payload.pub_date = useDateParser_1.parseInvalidDateToDefault(payload.pub_date, "(NULL)");
        payload.is_prio =
            payload.is_prio === true || payload.is_prio === "true" ? 1 : 0;
        const sql_add_news = yield con.Modify(`UPDATE news SET
       title=@title,
       body=@body,
       audience=@audience,
       pub_date=@pub_date,
       is_prio=@is_prio,
       encoder_pk=@encoder_pk
       where news_pk=@news_pk;`, payload);
        if (sql_add_news > 0) {
            con.Commit();
            return {
                success: true,
                message: "The news has been updated successfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "No affected rows when trying to update the news",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const addNewsReaction = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.user_pk = user_pk;
        const sql_check_exist = yield con.Query(`SELECT * FROM news_reaction WHERE news_pk=@news_pk AND resident_pk=@user_pk`, payload);
        if (sql_check_exist.toString() == "") {
            const sql_add_news_reaction = yield con.Modify(`INSERT INTO news_reaction SET
      news_pk=@news_pk,
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
            const sql_update_news_reaction = yield con.Modify(`update  news_reaction SET
      reaction=@reaction
      where news_pk=@news_pk 
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
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const updateNewsReaction = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_add_news_reaction = yield con.Modify(`UPDATE news_reaction SET
      reaction=@news_pk
      WHERE
      react_pk=@react_pk;`, payload);
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
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const addNewsComment = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.user_pk = user_pk;
        const sql_add_news_reaction = yield con.Modify(`INSERT INTO news_comment SET
      news_pk=@news_pk,
      user_pk=@user_pk,
      body=@body;`, payload);
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
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const toggleLike = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const has_liked = yield con.QuerySingle(`
      SELECT count(*) as total from news_likes where news_pk=@news_pk and liked_by = liked_by;
    `, payload);
        if (has_liked.total) {
            const sql_delete_like = yield con.Modify(`
        DELETE FROM news_likes WHERE
        news_pk=@news_pk and 
        liked_by=@liked_by;
        `, payload);
            if (sql_delete_like > 0) {
                con.Commit();
                return {
                    success: true,
                };
            }
            else {
                con.Rollback();
                return {
                    success: false,
                    message: "Looks like something went wrong, unable to save your like action!",
                };
            }
        }
        else {
            const sql_add_like = yield con.Insert(`
        INSERT INTO news_likes SET
        news_pk=@news_pk,
        liked_by=@liked_by;
        `, payload);
            if (sql_add_like.affectedRows > 0) {
                con.Commit();
                return {
                    success: true,
                };
            }
            else {
                con.Rollback();
                return {
                    success: false,
                    message: "Looks like something went wrong, unable to save your like action!",
                };
            }
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getSingleNews = (news_pk) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const news = yield con.QuerySingle(`select * from news where news_pk = @news_pk`, {
            news_pk: news_pk,
        });
        news.status = yield con.QuerySingle(`select * from status where sts_pk=@sts_pk`, {
            sts_pk: news.sts_pk,
        });
        news.user = yield con.QuerySingle(`select * from vw_users where user_pk=@user_pk`, {
            user_pk: news.encoder_pk,
        });
        if ((_c = news === null || news === void 0 ? void 0 : news.user) === null || _c === void 0 ? void 0 : _c.pic) {
            news.user.pic = yield useFileUploader_1.GetUploadedImage((_d = news === null || news === void 0 ? void 0 : news.user) === null || _d === void 0 ? void 0 : _d.pic);
        }
        con.Commit();
        return {
            success: true,
            data: news,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
exports.default = {
    getNewsDataTable,
    addNews,
    updateNews,
    getSingleNews,
    addNewsReaction,
    updateNewsReaction,
    addNewsComment,
    republishNews,
    unpublishNews,
    getNewsDataPublished,
    getSingleNewsWithPhoto,
    getNewsComments,
    toggleLike,
    getNewsFiles,
};
//# sourceMappingURL=NewsRepository.js.map