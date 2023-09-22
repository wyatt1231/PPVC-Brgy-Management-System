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
  upload_files?: Array<any>;
  user_full_name?: string;
  user_pic?: string;
  user_pk?: string;

  user?: UserModel;
  status?: StatusMasterModel;
  files?: Array<PostsFileModel>;
}

export interface PostCommentModel {
  posts_comment_pk?: number;
  posts_pk?: number;
  user_pk?: number;
  body?: string;
  encoded_at?: string | Date;
  user?: UserModel;
}

export interface PostReactionModel {
  react_pk?: number;
  user_pk?: number;
  posts_pk?: number;
  reaction?: string;
  encoded_at?: Date;
}

export interface PostsFileModel {
  posts_file_pk?: number;
  posts_pk?: number;
  file_path?: string;
  file_name?: string;
  mimetype?: string;
  encoded_at?: string | Date;
  encoder_pk?: number;
  uploaded_file?: any;
}
