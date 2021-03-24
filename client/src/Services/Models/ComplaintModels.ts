import { StatusMasterModel } from "./StatusMasterModel";
import { UserModel } from "./UserModels";

export interface ComplaintModel {
  complaint_pk?: number;
  reported_by?: number;
  reported_at?: Date;
  title?: string;
  body?: string;
  sts_pk?: string;
  upload_files: Array<any>;
  complaint_file?: Array<ComplaintFilesModel>;
  user: UserModel;
  status?: StatusMasterModel;
}

export interface ComplaintFilesModel {
  complaint_file_pk?: number;
  complaint_pk?: number;
  file_name?: string;
  file_path?: string;
  mimetype?: string;
}
