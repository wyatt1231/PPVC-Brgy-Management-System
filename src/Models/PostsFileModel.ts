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
  