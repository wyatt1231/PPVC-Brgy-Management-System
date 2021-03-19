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
const addComplaint = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.reported_by = user_pk;
        const sql_add_complaint = yield con.Insert(`
        INSERT INTO complaint SET
        reported_by=@reported_by,
        body=@body;
         `, payload);
        if (sql_add_complaint.insertedId > 0) {
            con.Commit();
            return {
                success: true,
                message: "The complaint has been reported successfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "No affected rows while reporting the complaint",
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
const updateComplaint = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.reported_by = user_pk;
        const sql_update_complaint = yield con.Modify(`
          UPDATE complaint SET
          body=@body
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
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const addComplaintMessage = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.sent_by = user_pk;
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
const getSingleComplaint = (complaint_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`select * from complaint where complaint_pk = @complaint_pk`, {
            complaint_pk: complaint_pk,
        });
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
exports.default = {
    addComplaint,
    updateComplaint,
    addComplaintLog,
    addComplaintMessage,
    getSingleComplaint,
};
//# sourceMappingURL=ComplaintRepository.js.map