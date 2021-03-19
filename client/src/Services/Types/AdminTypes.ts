import { AdministratorModel } from "../Models/AdminModel";

export type AdminReducerTypes =
  | {
      type: "set_admin_data_table";
      admin_data_table: AdminDataTable;
    }
  | {
      type: "fetching_admin_data_table";
      fetching_admin_data_table: boolean;
    }
  | {
      type: "set_selected_admin";
      selected_admin: AdministratorModel;
    }
  | {
      type: "fetching_selected_admin";
      fetching_selected_admin: boolean;
    };

export interface AdminReducerModel {
  admin_data_table?: null | AdminDataTable;
  fetching_admin_data_table: boolean;
  selected_admin?: AdministratorModel;
  fetching_selected_admin: boolean;
}

interface AdminDataTable {
  limit: number;
  count: number;
  begin: number;
  table: Array<AdministratorModel>;
}
