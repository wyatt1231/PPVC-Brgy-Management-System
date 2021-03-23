import { StatusMasterModel } from "./StatusMasterModel";
import { UserModel } from "./UserModels";

export interface ComplaintLogModel {
  complaint_log_pk?: number;
  complaint_pk?: number;
  notes?: string;
  sts_pk?: string;
  encoder_pk?: number;
  encoded_at?: Date;
  status?: StatusMasterModel;
  user?: UserModel;
}
