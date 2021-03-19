export interface AdministratorModel {
  admin_pk?: number;
  user_pk?: number;
  pic?: string;
  email: string;
  phone: string;
  firstname?: string;
  lastname?: string;
  gender?: "M" | "F";
  sts_pk?: "";
  sts_desc?: "";
  encoder_pk?: number;
  encoded_at?: Date;
}
