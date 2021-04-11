import { NewsCommentModel } from "./NewsCommentModels";
import { StatusMasterModel } from "./StatusMasterModel";
import { UserModel } from "./UserModels";

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
  upload_files?: Array<any>;
  user_full_name?: string;
  user_pic?: string;
  pub_date?: string | Date;
  is_prio?: boolean | 0 | 1;
  comments?: Array<NewsCommentModel>;
  likes?: Array<NewsLikesModel>;
  user?: UserModel;
  status?: StatusMasterModel;
}

export interface NewsFileModel {
  news_file_pk?: number;
  news_pk?: number;
  file_path?: string;
  file_name?: string;
  mimetype?: string;
  encoded_at?: string | Date;
  encoder_pk?: number;
  uploaded_file?: any;
}

export interface NewsLikesModel {
  news_like_pk?: number;
  news_pk?: number;
  liked_by?: number;
  encoded_at?: string | Date;
}
