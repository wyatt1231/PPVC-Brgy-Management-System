import {
  ComplaintReducerModel,
  ComplaintReducerTypes,
} from "../Types/ComplaintTypes";

const defaultState: ComplaintReducerModel = {};

const ComplaintReducer = (
  state: ComplaintReducerModel = defaultState,
  action: ComplaintReducerTypes
): ComplaintReducerModel => {
  switch (action.type) {
    case "complaints_table": {
      return {
        ...state,
        complaints_table: action.complaints_table,
      };
    }
    case "fetch_complaints_table": {
      return {
        ...state,
        fetch_complaints_table: action.fetch_complaints_table,
      };
    }

    case "single_complaint": {
      return {
        ...state,
        single_complaint: action.single_complaint,
      };
    }
    case "fetch_single_complaint": {
      return {
        ...state,
        fetch_single_complaint: action.fetch_single_complaint,
      };
    }

    case "selected_complaint_log": {
      return {
        ...state,
        selected_complaint_log: action.selected_complaint_log,
      };
    }
    case "fetch_selected_complaint_log": {
      return {
        ...state,
        fetch_selected_complaint_log: action.fetch_selected_complaint_log,
      };
    }

    case "complaint_messages": {
      return {
        ...state,
        complaint_messages: action.complaint_messages,
      };
    }
    case "fetch_complaint_messages": {
      return {
        ...state,
        fetch_complaint_messages: action.fetch_complaint_messages,
      };
    }

    default:
      return state;
  }
};

export default ComplaintReducer;
