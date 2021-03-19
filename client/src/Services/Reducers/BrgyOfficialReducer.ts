import {
  BrgyOfficialReducerModel,
  BrgyOfficialReducerTypes,
} from "../Types/BrgyOfficialTypes";

const defaultState: BrgyOfficialReducerModel = {
  fetching_brgy_official_data_table: false,
  fetching_selected_brgy_official: false,
};

const BrgyOfficialReducer = (
  state: BrgyOfficialReducerModel = defaultState,
  action: BrgyOfficialReducerTypes
): BrgyOfficialReducerModel => {
  switch (action.type) {
    case "set_brgy_official_data_table": {
      return {
        ...state,
        brgy_official_data_table: action.brgy_official_data_table,
      };
    }
    case "fetching_brgy_official_data_table": {
      return {
        ...state,
        fetching_brgy_official_data_table:
          action.fetching_brgy_official_data_table,
      };
    }

    case "set_selected_brgy_official": {
      return {
        ...state,
        selected_brgy_official: action.selected_brgy_official,
      };
    }
    case "fetching_selected_brgy_official": {
      return {
        ...state,
        fetching_selected_brgy_official: action.fetching_selected_brgy_official,
      };
    }

    default:
      return state;
  }
};

export default BrgyOfficialReducer;
