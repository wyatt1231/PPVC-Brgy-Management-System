import { PostsFileModel } from "./PostsFileModel";
import { StatusMasterModel } from "./StatusMasterModel";
import { UserModel } from "./UserModels";

export interface PostsModel {
  posts_pk?: number;
  title?: string;
  body?: string;
  sts_pk?: string;
  sts_desc?: string;
  sts_color?: string;
  sts_backgroundColor?: string;
  encoded_at?: Date;
  encoder_pk?: number;
  news_files?: Array<PostsFileModel>;
  upload_files: Array<any>;
  user_full_name?: string;
  user_pic?: string;
  user_pk?: string;

  user?: UserModel;
  status?: StatusMasterModel;
  files?: Array<PostsFileModel>;
}
export interface PostFilesModel {
  posts_file_pk?: number;
  posts_pk?: number;
  file_name?: string;
  encoder_pk?: number;
  file_path?: string;
  mimetype?: string;
  
}
export interface PostCommentModel {
  posts_comment_pk?: number;
  posts_pk?: number;
  user_pk?: number;
  body?: string;
  encoded_at?: string | Date;
  user?: UserModel;
}
