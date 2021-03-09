export interface ComplaintModel {
  complaint_pk?: number;
  reported_by?: number;
  reported_at?: Date;
  body?: string;
  sts_pk?: string;
}
