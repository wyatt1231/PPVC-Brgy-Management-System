import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage, UploadFile } from "../Hooks/useFileUploader";
import { NewsCommentModel } from "../Models/NewsCommentModels";
import { NewsFileModel } from "../Models/NewsFileModel";
import { NewsLikesModel, NewsModel } from "../Models/NewsModels";
import { NewsReactionModel } from "../Models/NewsReactionModels";
import { ResponseModel } from "../Models/ResponseModels";


const getNewsDataPublished = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const news_table: Array<NewsModel> = await con.Query(
      `
      SELECT * FROM 
      (
        SELECT n.news_pk,n.title,n.body,n.sts_pk,CASE WHEN DATE_FORMAT(n.encoded_at,'%d')= DATE_FORMAT(CURDATE(),'%d') THEN CONCAT("Today at ",DATE_FORMAT(n.encoded_at,'%h:%m %p')) WHEN DATEDIFF(NOW(),n.encoded_at) >7 THEN DATE_FORMAT(n.encoded_at,'%b/%d %h:%m %p') WHEN DATEDIFF(NOW(),n.encoded_at) <=7 THEN  CONCAT(DATEDIFF(NOW(),n.encoded_at),'D')  ELSE DATE_FORMAT(n.encoded_at,'%b/%d %h:%m') END AS TIMESTAMP,n.encoder_pk , s.sts_desc,s.sts_color,s.sts_backgroundColor
        ,u.full_name user_full_name,u.pic user_pic,COUNT( nr.reaction)likes FROM news n 
        LEFT JOIN status s ON n.sts_pk = s.sts_pk 
          LEFT JOIN news_reaction nr ON nr.news_pk=n.news_pk
        LEFT JOIN vw_users u ON u.user_pk = n.encoder_pk WHERE n.sts_pk="PU" GROUP BY n.news_pk ORDER BY n.encoded_at DESC) tmp;
      `,
      null
    );

    for (const news of news_table) {
      news.upload_files = await con.Query(
        `
      select * from news_file where news_pk=@news_pk
      `,
        {
          news_pk: news.news_pk,
        }
      );

      news.comments = await con.Query(
        `
        SELECT nc.*,u.pic,u.full_name FROM news_comment nc LEFT JOIN vw_users u
        ON nc.user_pk = u.user_pk WHERE nc.news_pk = @news_pk
        `,
        {
          news_pk: news.news_pk,
        }
      );
    }

    con.Commit();
    return {
      success: true,
      data: news_table,
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
        LEFT JOIN status s ON n.sts_pk = s.sts_pk 
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

      file.comments = await con.Query(
        `
        SELECT nc.*,u.pic,u.full_name FROM news_comment nc LEFT JOIN vw_users u
        ON nc.user_pk = u.user_pk WHERE nc.news_pk = @news_pk
        `,
        {
          news_pk: file.news_pk,
        }
      );

      for (const com of file.comments) {
        com.pic = await GetUploadedImage(com.pic);
      }

      file.likes = await con.Query(
        `
        SELECT  u.full_name,nl.liked_by FROM news_likes nl JOIN vw_users u
        ON nl.liked_by = u.user_pk
        WHERE nl.news_pk = @news_pk;
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


const toggleLike = async (payload: NewsLikesModel): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const has_liked = await con.QuerySingle(
      `
      SELECT count(*) as total from news_likes where news_pk=@news_pk and liked_by = liked_by;
    `,
      payload
    );

    if (has_liked.total) {
      const sql_delete_like = await con.Modify(
        `
        DELETE FROM news_likes WHERE
        news_pk=@news_pk and 
        liked_by=@liked_by;
        `,
        payload
      );

      if (sql_delete_like > 0) {
        con.Commit();
        return {
          success: true,
        };
      } else {
        con.Rollback();
        return {
          success: false,
          message:
            "Looks like something went wrong, unable to save your like action!",
        };
      }
    } else {
      const sql_add_like = await con.Insert(
        `
        INSERT INTO news_likes SET
        news_pk=@news_pk,
        liked_by=@liked_by;
        `,
        payload
      );

      if (sql_add_like.affectedRows > 0) {
        con.Commit();
        return {
          success: true,
        };
      } else {
        con.Rollback();
        return {
          success: false,
          message:
            "Looks like something went wrong, unable to save your like action!",
        };
      }
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

const getSingleNews = async (news_pk: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: NewsModel = await con.QuerySingle(
      `select * from news where news_pk = @news_pk`,
      {
        news_pk: news_pk,
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
 
  updateNews,
  getSingleNews,

  updateNewsReaction,

  republishNews,
  unpublishNews,
  getNewsDataPublished,
 
  toggleLike,
};
