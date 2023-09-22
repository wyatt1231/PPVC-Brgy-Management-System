import { StatusMasterModel } from "./StatusMasterModel";

export interface ResidentModel {
  resident_pk?: number;
  user_pk?: number;
  pic?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  gender?: string;
  birth_date?: Date | string;
  resident_date?: Date | string;
  died_date?: Date | string;
  nationality?: string;
  religion?: string;
  civil_status?: string;
  dialect?: string;
  tribe?: string;
  with_disability?: string;
  phone?: string;
  email?: string;
  purok?: string;
  is_employed?: "y" | "n";
  employment?: string;
  house_income?: number;
  house_status?: string;
  voting_precinct?: string;
  is_brgy_official?: "y" | "n";
  house_ownership?: string;
  sts_pk?: string;
  sts_desc?: string;
  sts_color?: string;
  sts_backgroundColor?: string;
  encoder_pk?: number;
  encoded_at?: Date;
  ulo_pamilya?: string;
  kita?: number;
  educ?: string;
  status?: StatusMasterModel;

  //ext
  age?: number;

  brgy_official_pos?: string;
}
