import { BarangayOfficialModel } from "../Models/BarangayOfficialModels";

export type BrgyOfficialReducerTypes =
  | {
      type: "set_brgy_official_data_table";
      brgy_official_data_table: BrgyOfficialDataTable;
    }
  | {
      type: "fetching_brgy_official_data_table";
      fetching_brgy_official_data_table: boolean;
    }
  | {
      type: "set_selected_brgy_official";
      selected_brgy_official: BarangayOfficialModel;
    }
  | {
      type: "fetching_selected_brgy_official";
      fetching_selected_brgy_official: boolean;
    };

export interface BrgyOfficialReducerModel {
  brgy_official_data_table?: null | BrgyOfficialDataTable;
  fetching_brgy_official_data_table: boolean;
  selected_brgy_official?: BarangayOfficialModel;
  fetching_selected_brgy_official: boolean;
}

interface BrgyOfficialDataTable {
  limit: number;
  count: number;
  begin: number;
  table: Array<BarangayOfficialModel>;
}
