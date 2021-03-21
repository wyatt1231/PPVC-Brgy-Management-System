import { NewsCommentModel } from "./NewsCommentModels";
import { NewsFileModel } from "./NewsFileModel";

export interface NewsModel {
  news_pk?: number;
  audience?: string;
  title?: string;
  body?: string;
  sts_pk?: string;
  sts_desc?: string;
  sts_color?: string;
  sts_backgroundColor?: string;
  encoded_at?: Date;
  encoder_pk?: number;
  news_files?: Array<NewsFileModel>;
  upload_files: Array<any>;
  user_full_name?: string;
  user_pic?: string;
  user_pk?: string;
  comments?: Array<NewsCommentModel>;
  likes?: Array<NewsLikesModel>;
}

export interface NewsLikesModel {
  news_like_pk?: number;
  news_pk?: number;
  liked_by?: number;
  encoded_at?: string | Date;
}
