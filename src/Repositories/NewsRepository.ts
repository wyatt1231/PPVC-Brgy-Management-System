import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { UploadFile } from "../Hooks/useFileUploader";
import { NewsCommentModel } from "../Models/NewsCommentModels";
import { NewsFileModel } from "../Models/NewsFileModel";
import { NewsModel } from "../Models/NewsModels";
import { NewsReactionModel } from "../Models/NewsReactionModels";
import { ResponseModel } from "../Models/ResponseModels";

const getNewsDataTable = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<NewsModel> = await con.Query(
      `
      SELECT * FROM 
      (
        SELECT n.*, s.sts_desc,s.sts_color,s.sts_backgroundColor
        ,u.full_name user_full_name,u.pic user_pic FROM news n 
        LEFT JOIN STATUS s ON n.sts_pk = s.sts_pk 
        LEFT JOIN vw_users u ON u.user_pk = n.encoder_pk order by n.encoded_at desc) tmp;
      `,
      null
    );

    for (const file of data) {
      file.upload_files = await con.Query(
        `
      select * from news_file where news_pk=@news_pk
      `,
        {
          news_pk: file.news_pk,
        }
      );
    }

    con.Commit();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};
const addNews = async (
  payload: NewsModel,
  files: Array<File>,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.encoder_pk = user_pk;

    const sql_add_news = await con.Insert(
      `INSERT INTO news SET
         title=@title,
         audience=@audience,
         body=@body,
         encoder_pk=@encoder_pk;`,
      payload
    );

    if (sql_add_news.insertedId > 0) {
      for (const file of files) {
        const file_res = await UploadFile("src/Storage/Files/News/", file);

        if (!file_res.success) {
          con.Rollback();

          return file_res;
        }

        const news_file_payload: NewsFileModel = {
          file_path: file_res.data.path,
          file_name: file_res.data.name,
          mimetype: file_res.data.mimetype,
          encoder_pk: user_pk,
          news_pk: sql_add_news.insertedId,
        };

        const sql_add_news_file = await con.Insert(
          `INSERT INTO news_file SET
             news_pk=@news_pk,
             file_path=@file_path,
             file_name=@file_name,
             mimetype=@mimetype,
             encoder_pk=@encoder_pk;`,
          news_file_payload
        );

        if (sql_add_news_file.affectedRows < 1) {
          con.Rollback();

          return {
            success: false,
            message:
              "The process has been terminated when trying to save the file!",
          };
        }
      }

      con.Commit();
      return {
        success: true,
        message: "The news has been published successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while creating the news",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const republishNews = async (
  news_pk: number,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_republish_news = await con.Modify(
      `UPDATE news SET
       sts_pk='PU'
       where news_pk=@news_pk;`,
      {
        news_pk: news_pk,
      }
    );

    if (sql_republish_news > 0) {
      con.Commit();
      return {
        success: true,
        message: "The news has been republished successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while updating the news",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const unpublishNews = async (
  news_pk: number,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_republish_news = await con.Modify(
      `UPDATE news SET
       sts_pk='UP'
       where news_pk=@news_pk;`,
      {
        news_pk: news_pk,
      }
    );

    if (sql_republish_news > 0) {
      con.Commit();

      return {
        success: true,
        message: "The news has been unpublished!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while updating the news",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const updateNews = async (
  payload: NewsModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.encoder_pk = user_pk;

    const sql_add_news = await con.Modify(
      `UPDATE news SET
       title=@title,
       body=@body,
       audience=@audience,
       encoder_pk=@encoder_pk
       where news_pk=@news_pk;`,
      payload
    );

    if (sql_add_news > 0) {
      con.Commit();
      return {
        success: true,
        message: "The news has been updated successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows when trying to update the news",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const addNewsReaction = async (
  payload: NewsReactionModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.user_pk = user_pk;

    const sql_add_news_reaction = await con.Modify(
      `INSERT INTO news_reaction SET
      news_pk=@news_pk,
      reaction=@news_pk,
      user_pk=@user_pk;`,
      payload
    );

    if (sql_add_news_reaction > 0) {
      con.Commit();
      return {
        success: true,
        message: "Your reaction has beed added!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message:
          "Looks like something went wrong, unable to save your reaction!",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const updateNewsReaction = async (
  payload: NewsReactionModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_add_news_reaction = await con.Modify(
      `UPDATE news_reaction SET
      reaction=@news_pk
      WHERE
      react_pk=@react_pk;`,
      payload
    );

    if (sql_add_news_reaction > 0) {
      con.Commit();
      return {
        success: true,
        message: "Your reaction has beed added!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message:
          "Looks like something went wrong, unable to save your reaction!",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const addNewsComment = async (
  payload: NewsCommentModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.user_pk = user_pk;

    const sql_add_news_reaction = await con.Modify(
      `INSERT INTO news_comment SET
      news_pk=@news_pk,
      user_pk=@user_pk,
      body=@body;`,
      payload
    );

    if (sql_add_news_reaction > 0) {
      con.Commit();
      return {
        success: true,
        message: "Your reaction has beed added!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message:
          "Looks like something went wrong, unable to save your reaction!",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

// const getAdminDataTable = async (
//   payload: PaginationModel
// ): Promise<ResponseModel> => {
//   const con = await DatabaseConnection();
//   try {
//     await con.BeginTransaction();

//     const data: Array<NewsModel> = await con.QueryPagination(
//       `
//       SELECT * FROM (SELECT a.*,CONCAT(firstname,' ',lastname) fullname,s.sts_desc  FROM administrator a
//       LEFT JOIN STATUS s ON s.sts_pk = a.sts_pk) tmp
//       WHERE
//       (firstname like concat('%',@search,'%')
//       OR lastname like concat('%',@search,'%')
//       OR email like concat('%',@search,'%')
//       OR phone like concat('%',@search,'%')
//       OR sts_desc like concat('%',@search,'%'))
//       AND admin_pk != 1
//       `,
//       payload
//     );

//     const hasMore: boolean = data.length > payload.page.limit;

//     if (hasMore) {
//       data.splice(data.length - 1, 1);
//     }

//     const count: number = hasMore
//       ? -1
//       : payload.page.begin * payload.page.limit + data.length;

//     for (const admin of data) {
//       admin.pic = await GetUploadedImage(admin.pic);
//     }

//     con.Commit();
//     return {
//       success: true,
//       data: {
//         table: data,
//         begin: payload.page.begin,
//         count: count,
//         limit: payload.page.limit,
//       },
//     };
//   } catch (error) {
//     await con.Rollback();
//     console.error(`error`, error);
//     return {
//       success: false,
//       message: ErrorMessage(error),
//     };
//   }
// };

const getSingleNews = async (news_pk: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: NewsModel = await con.QuerySingle(
      `select * from news where news_pk = @news_pk`,
      {
        admin_pk: news_pk,
      }
    );

    con.Commit();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

export default {
  getNewsDataTable,
  addNews,
  updateNews,
  getSingleNews,
  addNewsReaction,
  updateNewsReaction,
  addNewsComment,
  republishNews,
  unpublishNews,
};
