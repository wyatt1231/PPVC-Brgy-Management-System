import { StatusMasterModel } from "./StatusMasterModel";

export interface AdministratorModel {
  admin_pk?: number;
  user_pk?: number;
  pic?: string;
  email?: string;
  phone?: string;
  firstname?: string;
  lastname?: string;
  gender?: "m" | "f";
  sts_pk?: string;
  sts_desc?: string;
  encoder_pk?: number;
  encoded_at?: Date;
  status?: StatusMasterModel;
}
