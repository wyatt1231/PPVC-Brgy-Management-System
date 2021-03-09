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
