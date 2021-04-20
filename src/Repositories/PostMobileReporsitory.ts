import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage, UploadFile } from "../Hooks/useFileUploader";
import { PostReactionModel } from "../Models/PostReactionModel";
import { PostsCommentModel } from "../Models/PostsCommentModel";
import {
  PostCommentModel,
  PostFilesModel,
  PostsModel,
} from "../Models/PostsModel";
import { ResponseModel } from "../Models/ResponseModels";

const getPosts = async (user_pk:number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();

  try {
    await con.BeginTransaction();
    const data: Array<PostsModel> = await con.Query(
      `
        SELECT * FROM 
      (SELECT p.posts_pk,p.title,p.body,p.sts_pk,CASE WHEN DATE_FORMAT(p.encoded_at,'%d')= DATE_FORMAT(CURDATE(),'%d') THEN CONCAT("Today at ",DATE_FORMAT(p.encoded_at,'%h:%m %p')) WHEN DATEDIFF(NOW(),p.encoded_at) >7 THEN DATE_FORMAT(p.encoded_at,'%b/%d %h:%m %p') WHEN DATEDIFF(NOW(),p.encoded_at) <=7 THEN  CONCAT(DATEDIFF(NOW(),p.encoded_at),'D')  ELSE DATE_FORMAT(p.encoded_at,'%b/%d %h:%m') END AS TIMESTAMP,p.encoder_pk , s.sts_desc,s.sts_color,s.sts_backgroundColor
        ,u.full_name user_full_name,u.pic user_pic FROM posts p
        LEFT JOIN status s ON p.sts_pk = s.sts_pk 
        LEFT JOIN vw_users u ON u.user_pk = p.encoder_pk WHERE p.sts_pk="PU"  GROUP BY p.posts_pk ORDER BY p.encoded_at DESC)tmp;
        `,null
    );
    for (const postsreactions of data) {
      postsreactions.reactions = await con.Query(
        `
        select count(reaction) as likes,resident_pk from posts_reaction where posts_pk=@posts_pk 
        `,
        {
          posts_pk: postsreactions.posts_pk,
        }
      );
    }
    for (const postcomments of data) {
      postcomments.totalcomments = await con.Query(
        `
        SELECT COUNT(body) AS comments FROM posts_comment WHERE posts_pk=@posts_pk 
        `,
        {
          posts_pk: postcomments.posts_pk,
        }
      );
    }
    for (const isLiked of data) {
      isLiked.liked = await con.Query(
        `
        SELECT reaction FROM posts_reaction WHERE posts_pk=@posts_pk AND resident_pk=@user_pk
        `,
        {
          posts_pk: isLiked.posts_pk,
          user_pk:user_pk
        }
      );
    }
    for (const comments of data) {
      comments.comments = await con.Query(
        `
        SELECT u.user_pk,pw.posts_comment_pk,pic,CONCAT(first_name,' ',middle_name,'. ',last_name) AS fullname,pw.body,CASE WHEN DATE_FORMAT(pw.encoded_at,'%d')= DATE_FORMAT(CURDATE(),'%d') THEN CONCAT("Today at ",DATE_FORMAT(pw.encoded_at,'%h:%m %p')) ELSE DATE_FORMAT(pw.encoded_at,'%m-%d-%y %h:%m') END AS TIMESTAMP  FROM posts_comment pw JOIN resident u ON pw.user_pk=u.user_pk  where posts_pk=@posts_pk limit 5
        `,
        {
          posts_pk: comments.posts_pk,
        }
      );

      for (const file of comments.comments) {
        const sql_get_pic = await con.QuerySingle(
          `SELECT pic FROM resident WHERE user_pk=${file?.user_pk} LIMIT 1`,
          null
        );
        file.user_pic = await GetUploadedImage(sql_get_pic?.pic);
        console.error(`error`, file.user_pk);
      }

    }


    for (const file of data) {
      const sql_get_pic = await con.QuerySingle(
        `SELECT pic FROM resident WHERE user_pk=${file?.encoder_pk} LIMIT 1`,
        null
      );
      file.user_pic = await GetUploadedImage(sql_get_pic?.pic);
      console.error(`error`, file.user_pk);
    }
    for (const file of data) {
      file.upload_files = await con.Query(
        `
        select * from posts_file where posts_pk=@posts_pk
        `,
        {
          posts_pk: file.posts_pk,
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
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getUserPosts = async (user_pk: number): Promise<ResponseModel> => {
    const con = await DatabaseConnection();
    try {
      await con.BeginTransaction();
  
      const data: Array<PostsModel> = await con.Query(
        `
          SELECT * FROM 
        (SELECT p.posts_pk,p.title,p.body,p.sts_pk,CASE WHEN DATE_FORMAT(p.encoded_at,'%d')= DATE_FORMAT(CURDATE(),'%d') THEN CONCAT("Today at ",DATE_FORMAT(p.encoded_at,'%h:%m %p')) WHEN DATEDIFF(NOW(),p.encoded_at) >7 THEN DATE_FORMAT(p.encoded_at,'%b/%d %h:%m %p') WHEN DATEDIFF(NOW(),p.encoded_at) <=7 THEN  CONCAT(DATEDIFF(NOW(),p.encoded_at),'D')  ELSE DATE_FORMAT(p.encoded_at,'%b/%d %h:%m') END AS TIMESTAMP,p.encoder_pk , s.sts_desc,s.sts_color,s.sts_backgroundColor
          ,u.full_name user_full_name,u.pic user_pic FROM posts p
          LEFT JOIN status s ON p.sts_pk = s.sts_pk 
        
          LEFT JOIN vw_users u ON u.user_pk = p.encoder_pk WHERE p.sts_pk="PU" AND u.user_pk=@user_pk  ORDER BY p.encoded_at DESC)tmp;
          `,
        {
          user_pk,
        }
      );
      for (const postsreactions of data) {
        postsreactions.reactions = await con.Query(
          `
          select count(reaction) as likes from posts_reaction where posts_pk=@posts_pk
          `,
          {
            posts_pk: postsreactions.posts_pk,
          }
        );
      }
      for (const postcomments of data) {
        postcomments.totalcomments = await con.Query(
          `
          SELECT COUNT(body) AS comments FROM posts_comment WHERE posts_pk=@posts_pk
          `,
          {
            posts_pk: postcomments.posts_pk,
          }
        );
      }
    
      for (const isLiked of data) {
        isLiked.liked = await con.Query(
          `
          SELECT reaction FROM posts_reaction WHERE posts_pk=@posts_pk AND resident_pk=@user_pk
          `,
          {
            posts_pk: isLiked.posts_pk,
            user_pk:user_pk
          }
        );
      }
      for (const file of data) {
        const sql_get_pic = await con.QuerySingle(
          `SELECT pic FROM resident WHERE user_pk=${file?.encoder_pk} LIMIT 1`,
          null
        );
        file.user_pic = await GetUploadedImage(sql_get_pic?.pic);
        console.error(`error`, file.user_pk);
      }
      for (const file of data) {
        file.upload_files = await con.Query(
          `
          select * from posts_file where posts_pk=@posts_pk
          `,
          {
            posts_pk: file.posts_pk,
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
  
  const getPostsReaction = async (): Promise<ResponseModel> => {
    const con = await DatabaseConnection();
    try {
      await con.BeginTransaction();
  
      const data: Array<PostsModel> = await con.Query(
        `
            SELECT CASE WHEN reaction="Like" THEN CASE WHEN COUNT(reaction) IS NULL THEN 0 ELSE COUNT(reaction)END END AS likereaction FROM posts_reaction
            `,
        null
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
  
  const getPostsComments = async (user_pk:number,posts_pk: string): Promise<ResponseModel> => {
    const con = await DatabaseConnection();
    try {
      await con.BeginTransaction();
  
      const data: Array<PostsModel> = await con.Query(
        `SELECT u.user_pk,pw.posts_comment_pk,pic,CONCAT(first_name,' ',middle_name,'. ',last_name) AS fullname,pw.body,CASE WHEN DATE_FORMAT(pw.encoded_at,'%d')= DATE_FORMAT(CURDATE(),'%d') THEN CONCAT("Today at ",DATE_FORMAT(pw.encoded_at,'%h:%m %p')) ELSE DATE_FORMAT(pw.encoded_at,'%m-%d-%y %h:%m') END AS TIMESTAMP  FROM posts_comment pw JOIN resident u ON pw.user_pk=u.user_pk  where posts_pk=@posts_pk`,
        {
          posts_pk: posts_pk,
        }
      );
      for (const file of data) {
        const sql_get_pic = await con.QuerySingle(
          `SELECT pic FROM resident WHERE user_pk=${file?.user_pk} LIMIT 1`,
          null
        );
        file.user_pic = await GetUploadedImage(sql_get_pic?.pic);
        console.error(`error`, file.user_pk);
      }
      for (const isLiked of data) {
        isLiked.liked = await con.Query(
          `
          SELECT reaction FROM posts_reaction WHERE posts_pk=@posts_pk AND resident_pk=@user_pk
          `,
          {
            posts_pk: posts_pk,
            user_pk:user_pk
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
  
  const addPosts = async (
    payload: PostsModel,
    files: Array<File>,
    user_pk: number
  ): Promise<ResponseModel> => {
    const con = await DatabaseConnection();
    try {
      await con.BeginTransaction();
  
      payload.encoder_pk = user_pk;
  
      const sql_add_posts = await con.Insert(
        `INSERT INTO posts SET
           title=@title,
           body=@body,
           sts_pk="PU",
           encoder_pk=@encoder_pk;`,
        payload
      );
  
      if (sql_add_posts.insertedId > 0) {
        for (const file of files) {
          const file_res = await UploadFile("src/Storage/Files/Posts/", file);
  
          if (!file_res.success) {
            con.Rollback();
  
            return file_res;
          }
  
          const posts_file_payload: PostFilesModel = {
            file_path: file_res.data.path,
            file_name: file_res.data.name,
            mimetype: file_res.data.mimetype,
            encoder_pk: user_pk,
            posts_pk: sql_add_posts.insertedId,
          };
  
          const sql_add_posts_file = await con.Insert(
            `INSERT INTO posts_file SET
               posts_pk=@posts_pk,
               file_path=@file_path,
               file_name=@file_name,
               mimetype=@mimetype,
               encoder_pk=@encoder_pk;`,
            posts_file_payload
          );
  
          if (sql_add_posts_file.affectedRows < 1) {
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
  const addPostComment = async (
    payload: PostsCommentModel,
    user_pk: number
  ): Promise<ResponseModel> => {
    const con = await DatabaseConnection();
    try {
      await con.BeginTransaction();
  
      payload.user_pk = user_pk;
  
      const sql_add_post_comment = await con.Insert(
        `INSERT INTO posts_comment SET
        posts_pk=@posts_pk,
        user_pk=@user_pk,
        body=@body;`,
        payload
      );
  
      if (sql_add_post_comment.insertedId > 0) {
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
  
  const addPostReaction = async (
    payload: PostReactionModel,
    user_pk: number
  ): Promise<ResponseModel> => {
    const con = await DatabaseConnection();
  
    try {
      await con.BeginTransaction();
  
      payload.user_pk = user_pk;
      const sql_check_exist = await con.Query(
        `SELECT * FROM posts_reaction WHERE posts_pk=@posts_pk AND resident_pk=@user_pk`,
        payload
      );
      if (sql_check_exist.toString() == "") {
        const sql_add_news_reaction = await con.Modify(
          `INSERT INTO posts_reaction SET
            posts_pk=@posts_pk,
            reaction=@reaction,
            resident_pk=@user_pk;`,
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
      } else {
        const sql_update_news_reaction = await con.Modify(
          `update  posts_reaction SET
            reaction=@reaction
            where posts_pk=@posts_pk 
            and
            resident_pk=@user_pk;`,
          payload
        );
        if (sql_update_news_reaction > 0) {
          con.Commit();
          return {
            success: true,
            message: "Your reaction has beed updated!",
          };
        } else {
          con.Rollback();
          return {
            success: false,
            message:
              "2 Looks like something went wrong, unable to save your reaction!",
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
  
  const getSinglePostWithPhoto = async (
    posts_pk: string,
    user_pk:number
  ): Promise<ResponseModel> => {
    const con = await DatabaseConnection();
    try {
      await con.BeginTransaction();
  
      const data: Array<PostsModel> = await con.Query(
        `
        SELECT * FROM 
        (    
    SELECT p.*, s.sts_desc,s.sts_color,s.sts_backgroundColor
          ,u.full_name user_full_name,u.pic user_pic FROM posts p
          LEFT JOIN status s ON p.sts_pk = s.sts_pk 
          LEFT JOIN vw_users u ON u.user_pk = p.encoder_pk WHERE p.posts_pk=@posts_pk ORDER BY p.encoded_at DESC) tmp;
        `,
        {
            posts_pk: posts_pk,
        }
      );
      for (const postsreactions of data) {
        postsreactions.reactions = await con.Query(
          `
          select count(reaction) as likes from posts_reaction where posts_pk=@posts_pk
          `,
          {
            posts_pk: posts_pk,
          }
        );
      }
      for (const postcomments of data) {
        postcomments.totalcomments = await con.Query(
          `
          SELECT COUNT(body) AS comments FROM posts_comment WHERE posts_pk=@posts_pk
          `,
          {
            posts_pk: postcomments.posts_pk,
          }
        );
      }
      for (const isLiked of data) {
        isLiked.liked = await con.Query(
          `
          SELECT reaction FROM posts_reaction WHERE posts_pk=@posts_pk AND resident_pk=@user_pk
          `,
          {
            posts_pk: isLiked.posts_pk,
            user_pk:user_pk
          }
        );
      }
      for (const file of data) {
        file.upload_files = await con.Query(
          `
        select * from posts_file where posts_pk=@posts_pk
        `,
          {
            posts_pk: file.posts_pk,
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
export default {
    addPosts,
    getSinglePostWithPhoto,
    getPosts,
    getUserPosts,
    addPostReaction,
    addPostComment,
    getPostsReaction,
    getPostsComments,
  };
