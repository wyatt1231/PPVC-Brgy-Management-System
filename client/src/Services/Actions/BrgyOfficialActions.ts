import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import BrgyOfficialApi from "../Api/BrgyOfficialApi";
import IServerResponse from "../Interface/IServerResponse";
import { BarangayOfficialModel } from "../Models/BarangayOfficialModels";
import { PaginationModel } from "../Models/PaginationModels";
import { BrgyOfficialReducerTypes } from "../Types/BrgyOfficialTypes";
import { PageReducerTypes } from "../Types/PageTypes";

export const setBrgyOfficialDataTableAction = (
  payload: PaginationModel
) => async (dispatch: Dispatch<BrgyOfficialReducerTypes>) => {
  try {
    dispatch({
      type: "fetching_brgy_official_data_table",
      fetching_brgy_official_data_table: true,
    });
    const response: IServerResponse = await BrgyOfficialApi.getBrgyOfficialDataTableApi(
      payload
    );
    dispatch({
      type: "fetching_brgy_official_data_table",
      fetching_brgy_official_data_table: false,
    });
    if (response.success) {
      dispatch({
        type: "set_brgy_official_data_table",
        brgy_official_data_table: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const addBarangayOfficialAction = (
  payload: BarangayOfficialModel,
  onSuccess: (msg: string) => any
) => async (
  dispatch: Dispatch<BrgyOfficialReducerTypes | PageReducerTypes>
) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await BrgyOfficialApi.addBarangayOfficialApi(
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
