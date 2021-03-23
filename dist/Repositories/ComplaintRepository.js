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
const addComplaint = (payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_add_complaint = yield con.Insert(`
        INSERT INTO complaint SET
        reported_by=@reported_by,
        title=@title,
        body=@body,
        sts_pk="P";
         `, payload);
        if (sql_add_complaint.insertedId > 0) {
            for (const file of files) {
                const file_res = yield useFileUploader_1.UploadFile("src/Storage/Files/Complaints/", file);
                if (!file_res.success) {
                    con.Rollback();
                    return file_res;
                }
                const news_file_payload = {
                    file_path: file_res.data.path,
                    file_name: file_res.data.name,
                    mimetype: file_res.data.mimetype,
                    complaint_pk: sql_add_complaint.insertedId,
                };
                const sql_add_news_file = yield con.Insert(`INSERT INTO complaint_file SET
             complaint_pk=@complaint_pk,
             file_name=@file_name,
             file_path=@file_path,
             mimetype=@mimetype;`, news_file_payload);
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
                message: "The complaint has been saved successfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "No affected rows while saving the complaint",
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
const updateComplaint = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_update_complaint = yield con.Modify(`
          UPDATE complaint SET
          body=@body,
          title=@title
          where complaint_pk=@complaint_pk;
          ;
           `, payload);
        if (sql_update_complaint > 0) {
            con.Commit();
            return {
                success: true,
                message: "The complaint has been updated successfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "No affected rows while updating the complaint",
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
const addComplaintLog = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.encoder_pk = user_pk;
        const sql_update_complaint_status = yield con.Modify(`UPDATE complaint set sts_pk = @sts_pk where complaint_pk = @complaint_pk`, payload);
        if (sql_update_complaint_status) {
            const sql_add_complaint_log = yield con.Insert(`
                INSERT into complaint_log SET
                complaint_pk=@complaint_pk,
                notes=@notes,
                sts_pk=@sts_pk,
                encoder_pk=@encoder_pk;
                 `, payload);
            if (sql_add_complaint_log.affectedRows > 0) {
                con.Commit();
                return {
                    success: true,
                    message: "The complaint update has been saved successfully!",
                };
            }
            else {
                con.Rollback();
                return {
                    success: false,
                    message: "No affected rows while saving the complaint update",
                };
            }
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "No affected rows while updating the complaint status",
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
const getComplaintLogTable = (complaint_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        const log_table = yield con.Query(` SELECT * FROM complaint_log WHERE complaint_pk = @complaint_pk order by encoded_at desc`, {
            complaint_pk: complaint_pk,
        });
        for (const log of log_table) {
            log.user = yield con.QuerySingle(`Select * from vw_users where user_pk = @user_pk`, {
                user_pk: log.encoder_pk,
            });
            log.status = yield con.QuerySingle(`Select * from status where sts_pk = @sts_pk`, {
                sts_pk: log.sts_pk,
            });
        }
        return {
            success: true,
            data: log_table,
        };
    }
    catch (error) {
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getSingleComplaint = (complaint_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const single_complaint = yield con.QuerySingle(`Select * from complaint where complaint_pk = @complaint_pk;`, {
            complaint_pk: complaint_pk,
        });
        single_complaint.complaint_file = yield con.Query(`
        select * from complaint_file where complaint_pk=@complaint_pk
      `, {
            complaint_pk: complaint_pk,
        });
        single_complaint.user = yield con.QuerySingle(`Select * from vw_users where user_pk = @user_pk`, {
            user_pk: single_complaint.reported_by,
        });
        single_complaint.user.pic = yield useFileUploader_1.GetUploadedImage(single_complaint.user.pic);
        single_complaint.status = yield con.QuerySingle(`Select * from status where sts_pk = @sts_pk;`, {
            sts_pk: single_complaint.sts_pk,
        });
        con.Commit();
        return {
            success: true,
            data: single_complaint,
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
const getComplaintTable = (reported_by) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const complaint_table = yield con.Query(`Select * from complaint`, {
            reported_by: reported_by,
        });
        for (const complaint of complaint_table) {
            complaint.complaint_file = yield con.Query(`
        select * from complaint_file where complaint_pk=@complaint_pk
      `, {
                complaint_pk: complaint.complaint_pk,
            });
            complaint.user = yield con.QuerySingle(`Select * from vw_users where user_pk = @user_pk`, {
                user_pk: complaint.reported_by,
            });
            complaint.user.pic = yield useFileUploader_1.GetUploadedImage(complaint.user.pic);
        }
        con.Commit();
        return {
            success: true,
            data: complaint_table,
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
//messages
const addComplaintMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_add_complaint_msg = yield con.Insert(`
            INSERT into complaint_message SET
            complaint_pk=@complaint_pk,
            body=@body,
            sent_by=@sent_by;
             `, payload);
        if (sql_add_complaint_msg.affectedRows > 0) {
            con.Commit();
            return {
                success: true,
                message: "The complaint has been updated successfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "No affected rows while updating the complaint",
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
const getComplaintMessage = (complaint_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        const table_messages = yield con.Query(` SELECT * FROM complaint_message WHERE  complaint_pk =@complaint_pk;`, {
            complaint_pk: complaint_pk,
        });
        for (const message of table_messages) {
            message.user = yield con.QuerySingle(`SELECT * from vw_users where user_pk = @user_pk`, {
                user_pk: message.sent_by,
            });
            message.user.pic = yield useFileUploader_1.GetUploadedImage(message.user.pic);
        }
        return {
            success: true,
            data: table_messages,
        };
    }
    catch (error) {
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
exports.default = {
    addComplaint,
    updateComplaint,
    addComplaintLog,
    addComplaintMessage,
    getSingleComplaint,
    getComplaintTable,
    getComplaintMessage,
    getComplaintLogTable,
};
//# sourceMappingURL=ComplaintRepository.js.map