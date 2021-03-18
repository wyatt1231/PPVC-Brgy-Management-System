export interface AdministratorModel {
  admin_pk?: number;
  user_pk?: number;
  pic?: string;
  email: string;
  phone: string;
  firstname?: string;
  lastname?: string;
  gender?: "m" | "f";
  sts_pk?: "";
  sts_desc?: "";
  encoder_pk?: number;
  encoded_at?: Date;
}
