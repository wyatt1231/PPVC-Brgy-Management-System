import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import ResidentApi from "../Api/ResidentApi";
import IServerResponse from "../Interface/IServerResponse";
import { ResidentModel } from "../Models/ResidentModels";
import { PaginationModel } from "../Models/PaginationModels";
import { ResidentReducerTypes } from "../Types/ResidentTypes";
import { PageReducerTypes } from "../Types/PageTypes";

export const setResidentDataTableAction = (payload: PaginationModel) => async (
  dispatch: Dispatch<ResidentReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_resident_data_table",
      fetch_resident_data_table: true,
    });
    const response: IServerResponse = await ResidentApi.getResidentDataTableApi(
      payload
    );
    console.log(`resident res`, response);
    dispatch({
      type: "fetch_resident_data_table",
      fetch_resident_data_table: false,
    });
    if (response.success) {
      dispatch({
        type: "set_resident_data_table",
        resident_data_table: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const setSingleResidentAction = (resident_pk: string) => async (
  dispatch: Dispatch<ResidentReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_selected_resident",
      fetch_selected_resident: true,
    });
    const response: IServerResponse = await ResidentApi.getSingleResident(
      resident_pk
    );
    dispatch({
      type: "fetch_selected_resident",
      fetch_selected_resident: false,
    });
    if (response.success) {
      dispatch({
        type: "set_selected_resident",
        selected_resident: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const addResidentAction = (
  payload: ResidentModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<ResidentReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await ResidentApi.addResidentApi(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        onSuccess(response.message.toString());
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

export const updateResidentAction = (
  payload: ResidentModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<ResidentReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await ResidentApi.updateResidentApi(
      payload
    );
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        onSuccess(response.message.toString());
      }
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};
