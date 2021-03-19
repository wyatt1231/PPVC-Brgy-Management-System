import { ResidentModel } from "../Models/ResidentModels";

export type ResidentReducerTypes =
  | {
      type: "set_resident_data_table";
      resident_data_table: ResidentDataTable;
    }
  | {
      type: "fetch_resident_data_table";
      fetch_resident_data_table: boolean;
    }
  | {
      type: "set_selected_resident";
      selected_resident: ResidentModel;
    }
  | {
      type: "fetch_selected_resident";
      fetch_selected_resident: boolean;
    };

export interface ResidentReducerModel {
  resident_data_table?: null | ResidentDataTable;
  fetch_resident_data_table: boolean;
  selected_resident?: ResidentModel;
  fetching_selected_resident: boolean;
}

interface ResidentDataTable {
  limit: number;
  count: number;
  begin: number;
  table: Array<ResidentModel>;
}
