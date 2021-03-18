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
  news_files?: Array<PostsFileModel>;
  upload_files: Array<any>;
  user_full_name?: string;
  user_pic?: string;
  user_pk?: string;
}
