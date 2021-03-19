import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import NewsApi from "../Api/NewsApi";
import IServerResponse from "../Interface/IServerResponse";
import { NewsModel } from "../Models/NewsModels";
import { NewsReducerTypes } from "../Types/NewsTypes";
import { PageReducerTypes } from "../Types/PageTypes";

export const getNewsDataTableAction = () => async (
  dispatch: Dispatch<NewsReducerTypes>
) => {
  try {
    dispatch({
      type: "fetching_news_data_table",
      fetching_news_data_table: true,
    });
    const response: IServerResponse = await NewsApi.getNewsDataTableApi();
    dispatch({
      type: "fetching_news_data_table",
      fetching_news_data_table: false,
    });
    if (response.success) {
      dispatch({
        type: "set_news_data_table",
        news_data_table: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const setSingleResidentAction = (news_pk: number) => async (
  dispatch: Dispatch<NewsReducerTypes>
) => {
  try {
    dispatch({
      type: "fetching_selected_news",
      fetching_selected_news: true,
    });
    const response: IServerResponse = await NewsApi.getSingleNewsApi(news_pk);
    dispatch({
      type: "fetching_selected_news",
      fetching_selected_news: false,
    });
    if (response.success) {
      dispatch({
        type: "set_selected_news",
        selected_news: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const addNewsAction = (
  payload: NewsModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<NewsReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await NewsApi.addNewsApi(payload);
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

export const updateNewsApi = (
  payload: NewsModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<NewsReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await NewsApi.updateNewsApi(payload);
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
