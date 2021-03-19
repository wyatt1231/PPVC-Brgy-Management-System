export interface ComplaintModel {
  complaint_pk?: number;
  reported_by?: number;
  reported_at?: Date;
  subject?: string;
  body?: string;
  sts_pk?: string;
  complaint_file?: Array<any>;
}
