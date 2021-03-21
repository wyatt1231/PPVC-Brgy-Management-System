import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import ComplaintApi from "../Api/ComplaintApi";
import IServerResponse from "../Interface/IServerResponse";
import { ComplaintLogModel } from "../Models/ComplaintLogModels";
import { ComplaintReducerTypes } from "../Types/ComplaintTypes";
import { PageReducerTypes } from "../Types/PageTypes";

const setComplaintTable = () => async (
  dispatch: Dispatch<ComplaintReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_complaints_table",
      fetch_complaints_table: true,
    });
    const response: IServerResponse = await ComplaintApi.getComplaintTable();

    if (response.success) {
      dispatch({
        type: "complaints_table",
        complaints_table: response.data,
      });
    }

    dispatch({
      type: "fetch_complaints_table",
      fetch_complaints_table: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const setSingleComplaint = (news_pk: number) => async (
  dispatch: Dispatch<ComplaintReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_single_complaint",
      fetch_single_complaint: true,
    });
    const response: IServerResponse = await ComplaintApi.getSingleComplaint(
      news_pk
    );

    if (response.success) {
      dispatch({
        type: "single_complaint",
        single_complaint: response.data,
      });
    }

    dispatch({
      type: "fetch_single_complaint",
      fetch_single_complaint: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const addComplaintLog = (
  payload: ComplaintLogModel,
  successCallback: (msg: string) => any
) => async (dispatch: Dispatch<ComplaintReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await ComplaintApi.addComplaintLog(
      payload
    );
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof successCallback === "function") {
        successCallback(response.message.toString());
      }
      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export default {
  setComplaintTable,
  setSingleComplaint,
  addComplaintLog,
};
