import {
  ResidentReducerModel,
  ResidentReducerTypes,
} from "../Types/ResidentTypes";

const defaultState: ResidentReducerModel = {
  fetch_resident_data_table: false,
  fetching_selected_resident: false,
};

const ResidentReducer = (
  state: ResidentReducerModel = defaultState,
  action: ResidentReducerTypes
): ResidentReducerModel => {
  switch (action.type) {
    case "set_resident_data_table": {
      return {
        ...state,
        resident_data_table: action.resident_data_table,
      };
    }
    case "fetch_resident_data_table": {
      return {
        ...state,
        fetch_resident_data_table: action.fetch_resident_data_table,
      };
    }

    case "set_selected_resident": {
      return {
        ...state,
        selected_resident: action.selected_resident,
      };
    }
    case "fetch_selected_resident": {
      return {
        ...state,
        fetching_selected_resident: action.fetch_selected_resident,
      };
    }

    default:
      return state;
  }
};

export default ResidentReducer;
