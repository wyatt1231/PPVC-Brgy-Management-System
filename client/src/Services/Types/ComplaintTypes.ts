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
    };

export interface ComplaintReducerModel {
  complaints_table?: Array<ComplaintModel>;
  fetch_complaints_table?: boolean;
  single_complaint?: ComplaintModel;
  fetch_single_complaint?: boolean;
}
