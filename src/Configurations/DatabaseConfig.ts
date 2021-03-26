import mysql, { OkPacket, RowDataPacket } from "mysql2";
import { DatabaseConnectionModel, InsertModel } from "../Models/DatabaseModel";
import { PaginationModel } from "../Models/PaginationModel";

let con: mysql.PoolOptions | null = null;

if (process.env.NODE_ENV === "production") {
  con = {
    host: "sql6.freemysqlhosting.net",
    user: "sql6400894",
    password: "R9R8CS57Mw",
    database: "sql6400894",
    port: 3306,
    connectionLimit: 10,
    waitForConnections: true,
  };
} else {
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

export let DatabaseConfig = mysql.createPool(con);

export const DatabaseConnection = (): Promise<DatabaseConnectionModel> => {
  return new Promise((resolve, reject) => {
    DatabaseConfig.getConnection((error, connection) => {
      if (error) {
        reject(error);
      }

      const Query = (sql: string, binding: any): Promise<RowDataPacket[][]> => {
        return new Promise((resolve, reject) => {
          const { success, message, query } = queryFormat(sql, binding);

          if (!success) {
            if (typeof message !== "undefined") {
              return reject(message);
            }
          }

          connection.query(query, (err, result: RowDataPacket[][]) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      };

      const QueryPagination = (
        sql: string,
        pagination: PaginationModel
      ): Promise<Array<any>> => {
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
          ORDER BY ${sort.column} ${sort.direction}
          LIMIT ${mysql.escape(page.begin)}, ${mysql.escape(page.limit)} `;
          connection.query(full_query, (err, result: RowDataPacket[][]) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      };
      const Modify = (sql: string, binding: any): Promise<number> => {
        return new Promise((resolve, reject) => {
          const { success, message, query } = queryFormat(sql, binding);
          if (!success) {
            if (typeof message !== "undefined") {
              return reject(message);
            }
          }
          connection.query(query, (err, result: OkPacket) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.affectedRows);
            }
          });
        });
      };
      const Insert = (sql: string, binding: any): Promise<InsertModel> => {
        return new Promise((resolve, reject) => {
          const { success, message, query } = queryFormat(sql, binding);
          if (!success) {
            if (typeof message !== "undefined") {
              return reject(message);
            }
          }
          connection.query(query, (err, result: OkPacket) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                affectedRows: result.affectedRows,
                insertedId: result.insertId,
              });
            }
          });
        });
      };
      const QuerySingle = (sql: string, binding: any): Promise<any> => {
        return new Promise((resolve, reject) => {
          const { success, message, query } = queryFormat(sql, binding);
          if (!success) {
            if (typeof message !== "undefined") {
              return reject(message);
            }
          }
          connection.query(query, (err, result: RowDataPacket) => {
            if (err) {
              reject(err);
            } else {
              if (result.length > 0) {
                // console.log(`result[0]`, result[0]);
                resolve(result[0]);
              } else {
                resolve(null);
              }
            }
          });
        });
      };
      const BeginTransaction = (): Promise<void> => {
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
      const Commit = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          connection.commit((err) => {
            connection.release();
            connection.destroy();
            resolve();
          });
        });
      };
      const Rollback = (): Promise<void> => {
        return new Promise((resolve) => {
          connection.rollback(() => {
            connection.release();
            connection.destroy();
            resolve();
          });
        });
      };
      const Release = (): Promise<void> => {
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
interface QueryFormatModel {
  success: boolean;
  message?: string;
  query: string;
}

const queryFormat = (query: string, values: any): QueryFormatModel => {
  const formattedQuery: QueryFormatModel = {
    success: true,
    query: query,
  };
  formattedQuery.query = query.replace(
    /\@(\w+)/g,
    (str: string, key: string | Array<string>) => {
      if (typeof key === "string") {
        if (values.hasOwnProperty(key)) {
          if (values[key] === null || typeof values[key] === "undefined") {
            return "(NULL)";
          }
          if (values[key] instanceof Array) {
            const formatArritem = values[key].map((v) => mysql.escape(v));
            const arr_rep: string = formatArritem.join(",");
            return ` (${arr_rep}) `;
          }
          return mysql.escape(values[key]);
        } else {
          if (typeof formattedQuery.message === "undefined") {
            formattedQuery.message = `Column value error : ${key} cannot be found`;
          }
          formattedQuery.success = false;
          return str;
        }
      }

      if (key instanceof Array) {
        for (let i = 0; i < key.length; i++) {
          key[i] = mysql.escape(key[i]);
        }
        const joined_arr = key.join(",");

        return joined_arr;
      }

      return str;
    }
  );

  return formattedQuery;
};
