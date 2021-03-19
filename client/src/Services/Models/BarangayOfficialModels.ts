export interface BarangayOfficialModel {
  official_pk?: number;
  resident_pk?: number;
  resident_name?: string;
  position?: string;
  sts_pk?: string;
  encoder_pk?: number;
  encoded_at?: Date | string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  pic?: string;
  gender?: string;
  sts_color?: string;
  sts_desc?: string;
  sts_backgroundColor?: string;
}
