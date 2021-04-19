"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnection = exports.DatabaseConfig = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
let con = null;
if (process.env.NODE_ENV === "production") {
    con = {
        host: "freedb.tech",
        user: "freedbtech_zxcpoklcapstone",
        password: "zxcpoklcapstone",
        database: "freedbtech_zxcpoklcapstone",
        port: 3306,
        connectionLimit: 10,
        waitForConnections: true,
    };
}
else {
    // con = {
    //   host: "freedb.tech",
    //   user: "freedbtech_zxcpoklcapstone",
    //   password: "zxcpoklcapstone",
    //   database: "freedbtech_zxcpoklcapstone",
    //   port: 3306,
    //   connectionLimit: 10,
    //   waitForConnections: true,
    // };
    con = {
        host: "localhost",
        user: "root",
        password: "root sa",
        database: "bms",
        port: 3309,
        connectionLimit: 10,
        waitForConnections: true,
    };
}
//console.log(`some config`)
exports.DatabaseConfig = mysql2_1.default.createPool(con);
const DatabaseConnection = () => {
    return new Promise((resolve, reject) => {
        exports.DatabaseConfig.getConnection((error, connection) => {
            if (error) {
                reject(error);
            }
            const Query = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    const { success, message, query } = queryFormat(sql, binding);
                    if (!success) {
                        if (typeof message !== "undefined") {
                            return reject(message);
                        }
                    }
                    connection.query(query, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
            };
            const QueryPagination = (sql, pagination) => {
                return new Promise((resolve, reject) => {
                    const { filters, sort, page } = pagination;
                    const { success, message, query } = queryFormat(sql, filters);
                    if (!success) {
                        if (typeof message !== "undefined") {
                            return reject(message);
                        }
                    }
                    const full_query = `
          ${query} 
          ORDER BY ${sort.column} ${sort.direction}` +
                        (page
                            ? `
        LIMIT ${mysql2_1.default.escape(page.begin)}, ${mysql2_1.default.escape(page.limit)} `
                            : "");
                    connection.query(full_query, (err, result) => {
                        if (err) {
                            console.log(`full_query `, full_query);
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
            };
            const Modify = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    const { success, message, query } = queryFormat(sql, binding);
                    if (!success) {
                        if (typeof message !== "undefined") {
                            return reject(message);
                        }
                    }
                    connection.query(query, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result.affectedRows);
                        }
                    });
                });
            };
            const Insert = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    const { success, message, query } = queryFormat(sql, binding);
                    if (!success) {
                        if (typeof message !== "undefined") {
                            return reject(message);
                        }
                    }
                    connection.query(query, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve({
                                affectedRows: result.affectedRows,
                                insertedId: result.insertId,
                            });
                        }
                    });
                });
            };
            const QuerySingle = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    const { success, message, query } = queryFormat(sql, binding);
                    if (!success) {
                        if (typeof message !== "undefined") {
                            return reject(message);
                        }
                    }
                    connection.query(query, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            if (result.length > 0) {
                                // console.log(`result[0]`, result[0]);
                                resolve(result[0]);
                            }
                            else {
                                resolve(null);
                            }
                        }
                    });
                });
            };
            const BeginTransaction = () => {
                return new Promise((resolve, reject) => {
                    connection.beginTransaction((err) => {
                        if (err) {
                            // connection.release();
                            // connection.destroy();
                        }
                        resolve();
                    });
                });
            };
            const Commit = () => {
                return new Promise((resolve, reject) => {
                    connection.commit((err) => {
                        connection.release();
                        connection.destroy();
                        resolve();
                    });
                });
            };
            const Rollback = () => {
                return new Promise((resolve) => {
                    connection.rollback(() => {
                        connection.release();
                        connection.destroy();
                        resolve();
                    });
                });
            };
            const Release = () => {
                return new Promise((resolve) => {
                    connection.release();
                    connection.destroy();
                    resolve();
                });
            };
            resolve({
                Release,
                Commit,
                Rollback,
                BeginTransaction,
                Query,
                QuerySingle,
                QueryPagination,
                Modify,
                Insert,
            });
        });
    });
};
exports.DatabaseConnection = DatabaseConnection;
const queryFormat = (query, values) => {
    const formattedQuery = {
        success: true,
        query: query,
    };
    formattedQuery.query = query.replace(/\@(\w+)/g, (str, key) => {
        if (typeof key === "string") {
            if (values.hasOwnProperty(key)) {
                if (values[key] === null || typeof values[key] === "undefined") {
                    return "(NULL)";
                }
                if (values[key] instanceof Array) {
                    const furnished_arr = values[key].filter((v) => !!v);
                    if (furnished_arr.length > 0) {
                        const formatArritem = furnished_arr.map((v) => mysql2_1.default.escape(v));
                        const arr_rep = formatArritem.join(",");
                        return ` (${arr_rep}) `;
                    }
                    else {
                        return ` ('') `;
                    }
                }
                return mysql2_1.default.escape(values[key]);
            }
            else {
                if (typeof formattedQuery.message === "undefined") {
                    formattedQuery.message = `Column value error : ${key} cannot be found`;
                }
                formattedQuery.success = false;
                return str;
            }
        }
        return str;
    });
    // console.log(`formattedQuery`, formattedQuery);
    return formattedQuery;
};
//# sourceMappingURL=DatabaseConfig.js.map