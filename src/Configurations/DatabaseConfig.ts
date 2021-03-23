import mysql, { OkPacket, RowDataPacket } from "mysql2";
import { DatabaseConnectionModel, InsertModel } from "../Models/DatabaseModel";
import { PaginationModel } from "../Models/PaginationModel";

<<<<<<< HEAD
export let DatabaseConfig = (): mysql.Pool => {
  if (process.env.NODE_ENV === "production") {
    // return mysql.createPool({
    //   host: "us-cdbr-east-03.cleardb.com",
    //   user: "bed41c71c3944a",
    //   password: "f1ec4cc8",
    //   database: "heroku_fcd8378bc75cb9b",
    //   port: 3306,
    //   connectionLimit: 10,
    // });
    return mysql.createPool({
      host: "sql6.freemysqlhosting.net",
      user: "sql6400894",
      password: "R9R8CS57Mw",
      database: "sql6400894",
      port: 3306,
      connectionLimit: 10,
    });
  } else {
    return mysql.createPool({
      host: "127.0.0.1",
      user: "root",
      password: "rootsa",
      database: "bms",
      port: 3309,
    });
  }
};
=======
// export const DatabaseConfig = mysql.createPool({
//   host: "us-cdbr-east-03.cleardb.com",
//   user: "bed41c71c3944a",
//   password: "f1ec4cc8",
//   database: "heroku_fcd8378bc75cb9b",
//   port: 3306,
// });

export const DatabaseConfig = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rootsa",
  database: "bms",
  port: 3309,
});
>>>>>>> 039d6da (posts and complaints changes)

export const DatabaseConnection = (): Promise<DatabaseConnectionModel> => {
  return new Promise((resolve, reject) => {
    DatabaseConfig().getConnection((error, connection) => {
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
        // binding: any,
        // sort: SqlSort,
        // page: SqlPage
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
              reject(err);
            } else {
              resolve();
            }
          });
        });
      };

      const Commit = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          connection.commit((err) => {
            connection.release();
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      };

      const Rollback = (): Promise<void> => {
        return new Promise((resolve) => {
          connection.rollback(() => {
            connection.release();
            resolve();
          });
        });
      };

      const Release = (): Promise<void> => {
        return new Promise((resolve) => {
          resolve(connection.release());
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

// const queryFormat = (query: string, values: any): QueryFormatModel => {
//   const formattedQuery: QueryFormatModel = {
//     success: true,
//     query: query,
//   };

//   formattedQuery.query = query.replace(
//     /\@(\w+)/g,
//     (str: string, key: string | Array<string>) => {
//       if (typeof key === "string") {
//         if (values.hasOwnProperty(key)) {
//           if (values[key]) {
//             return mysql.escape(values[key]);
//           } else {
//             return "(NULL)";
//           }
//         } else {
//           if (typeof formattedQuery.message === "undefined") {
//             formattedQuery.message = `Column value error : ${key} cannot be found`;
//           }
//           formattedQuery.success = false;
//           return str;
//         }
//       }

//       if (key instanceof Array) {
//         for (let i = 0; i < key.length; i++) {
//           key[i] = mysql.escape(key[i]);
//         }
//         const joined_arr = key.join(",");

//         return joined_arr;
//       }

//       return str;
//     }
//   );

//   return formattedQuery;
// };

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

export const query = (sql: any, binding: any) => {
  return new Promise((resolve, reject) => {
    DatabaseConfig().query(sql, binding, (err: any, result: any) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
