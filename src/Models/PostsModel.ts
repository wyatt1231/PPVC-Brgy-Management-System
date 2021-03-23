import { PostsFileModel } from "./PostsFileModel";

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
  posts_files?: Array<PostFilesModel>;
  upload_files: Array<any>;
  user_full_name?: string;
  user_pic?: string;
  user_pk?: string;
}
export interface PostFilesModel {
  posts_file_pk?: number;
  posts_pk?: number;
  file_name?: string;
  encoder_pk?: number;
  file_path?: string;
  mimetype?: string;
  
}