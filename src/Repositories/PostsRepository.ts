import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { UploadFile } from "../Hooks/useFileUploader";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { ResponseModel } from "../Models/ResponseModels";
import { PostCommentModel, PostFilesModel, PostsModel } from "../Models/PostsModel";
import { PostReactionModel } from "../Models/PostReactionModel";
import { PostsCommentModel } from "../Models/PostsCommentModel";
import { PostsFileModel } from "../Models/PostsFileModel";



// const getPosts = async (): Promise<ResponseModel> => {
//   const con = await DatabaseConnection();
//   try {
//     const posts: Array<PostsModel> = await con.Query(
//       `
//       SELECT * FROM posts`,
//       null
//     );

//     for (const post of posts) {
//       post.user = await con.QuerySingle(
//         `select * from vw_users where user_pk = @user_pk;`,
//         {
//           user_pk: post.encoder_pk,
//         }
//       );

//       post.user.pic = await GetUploadedImage(post.user.pic);

//       post.status = await con.QuerySingle(
//         `select * from status where sts_pk = @sts_pk;`,
//         {
//           sts_pk: post.sts_pk,
//         }
//       );

//       post.files = await con.Query(
//         `select * from posts_file where posts_pk=@posts_pk`,
//         {
//           posts_pk: post.posts_pk,
//         }
//       );
//     }

//     return {
//       success: true,
//       data: posts,
//     };
//   } catch (error) {
//     console.error(`error`, error);
//     return {
//       success: false,
//       message: ErrorMessage(error),
//     };
//   }
// };

//ADMIN POSTS

const getPostReactionsAdmin = async (
  posts_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<PostsModel> = await con.Query(
      `
       SELECT * FROM posts_reaction  WHERE posts_pk=@posts_pk; 
        `,
      {
        posts_pk: posts_pk,
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

//ADMIN REACTIONS

const getPostCommentsAdmin = async (
  posts_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    const comments: Array<PostCommentModel> = await con.Query(
      `
       SELECT * FROM posts_comment WHERE posts_pk = @posts_pk;
        `,
      {
        posts_pk: posts_pk,
      }
    );

    for (const comment of comments) {
      comment.user = await con.QuerySingle(
        `select * from vw_users where user_pk = @user_pk;`,
        {
          user_pk: comment.user_pk,
        }
      );
      comment.user.pic = await GetUploadedImage(comment.user.pic);
    }

    return {
      success: true,
      data: comments,
    };
  } catch (error) {
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

export default {
  getPostReactionsAdmin,
  getPostCommentsAdmin,
};
