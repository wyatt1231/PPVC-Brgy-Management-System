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
const getClassSessions = (class_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`select * from class_sessions where class_pk = @class_pk`, {
            class_pk: class_pk,
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
const getTutorClassSessionCalendar = (payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`SELECT * FROM 
       (SELECT cs.*, sm.sts_color,sm.sts_bgcolor,c.class_desc,c.tutor_pk FROM class_sessions cs
       LEFT JOIN status_master sm ON sm.sts_pk = cs.sts_pk
       LEFT JOIN classes c ON cs.class_pk = c.class_pk) tmp
       WHERE
       class_desc LIKE CONCAT('%',@search,'%')
       AND sts_pk IN @sts_pk
       AND MONTH(start_date) = @month
       AND YEAR(start_date) = @year
       and tutor_pk=getTutorPK(@user_pk)
       GROUP BY session_pk
      `, Object.assign(Object.assign({}, payload), { user_pk: user_id }));
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
const getStatsSessionCalendar = (user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const { for_approval } = yield con.QuerySingle(`
      SELECT COUNT(*) AS 'for_approval' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `, {
            user_pk: user_pk,
            sts_pk: "fa",
        });
        const { approved } = yield con.QuerySingle(`
      SELECT COUNT(*) AS 'approved' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `, {
            user_pk: user_pk,
            sts_pk: "a",
        });
        const { started } = yield con.QuerySingle(`
      SELECT COUNT(*) AS 'started' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `, {
            user_pk: user_pk,
            sts_pk: "e",
        });
        const { closed } = yield con.QuerySingle(`
      SELECT COUNT(*) AS 'closed' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `, {
            user_pk: user_pk,
            sts_pk: "c",
        });
        con.Commit();
        return {
            success: true,
            data: {
                for_approval,
                approved,
                started,
                closed,
            },
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
const getTutorFutureSessions = (tutor_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
      SELECT cs.start_date, cs.start_time,cs.end_time FROM class_sessions cs
      INNER JOIN classes c
      ON c.class_pk = cs.class_pk
      WHERE c.tutor_pk =@tutor_pk
      AND cs.start_date >= DATE(NOW());
      `, {
            tutor_pk: tutor_pk,
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
    getClassSessions,
    getTutorFutureSessions,
    getTutorClassSessionCalendar,
    getStatsSessionCalendar,
};
//# sourceMappingURL=ClassSessionRepository.js.map