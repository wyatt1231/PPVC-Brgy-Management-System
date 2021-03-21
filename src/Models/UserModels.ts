export interface UserLogin {
  email: string;
  password: string;
}

export interface UserClaims {
  user_pk?: number;
  user_type?: string;
  allow_login?: "y" | "n";
}

export interface UserModel {
  user_pk?: number;
  email?: string;
  password?: string;
  user_type?: string;
  full_name?: string;
  online_count?: string;
  sts_pk?: string;
  sts_desc?: string;
  encoded_at?: Date;
  encoder_pk?: string | number;
  allow_login?: "y" | "n";
  pic?: any;
}
