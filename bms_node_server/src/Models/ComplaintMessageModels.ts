export interface ComplaintMessageModel {
  complaint_msg_pk?: number;
  complaint_pk?: number;
  body?: string;
  sent_by?: number;
  sent_at?: Date;
  user_pic?: string;
}
