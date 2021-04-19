import { ComplaintLogModel } from "../Models/ComplaintLogModels";
import { ComplaintMessageModel } from "../Models/ComplaintMessageModels";
import { ComplaintModel } from "../Models/ComplaintModels";

export type ComplaintReducerTypes =
  | {
      type: "complaints_table";
      complaints_table: Array<ComplaintModel>;
    }
  | {
      type: "fetch_complaints_table";
      fetch_complaints_table: boolean;
    }
  | {
      type: "single_complaint";
      single_complaint: ComplaintModel;
    }
  | {
      type: "fetch_single_complaint";
      fetch_single_complaint: boolean;
    }
  | {
      type: "selected_complaint_log";
      selected_complaint_log: Array<ComplaintLogModel>;
    }
  | {
      type: "fetch_selected_complaint_log";
      fetch_selected_complaint_log: boolean;
    }
  //
  | {
      type: "complaint_messages";
      complaint_messages: Array<ComplaintMessageModel>;
    }
  | {
      type: "fetch_complaint_messages";
      fetch_complaint_messages: boolean;
    }
  //
  | {
      type: "latest_complaint";
      latest_complaint: Array<ComplaintModel>;
    }
  | {
      type: "fetch_latest_complaint";
      fetch_latest_complaint: boolean;
    };

export interface ComplaintReducerModel {
  complaints_table?: Array<ComplaintModel>;
  fetch_complaints_table?: boolean;
  single_complaint?: ComplaintModel;
  fetch_single_complaint?: boolean;

  selected_complaint_log?: Array<ComplaintLogModel>;
  fetch_selected_complaint_log?: boolean;

  complaint_messages?: Array<ComplaintMessageModel>;
  fetch_complaint_messages?: boolean;
  //
  latest_complaint?: Array<ComplaintModel>;
  fetch_latest_complaint?: boolean;
}
