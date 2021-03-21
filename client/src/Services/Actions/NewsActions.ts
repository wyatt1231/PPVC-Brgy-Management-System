import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import NewsApi from "../Api/NewsApi";
import IServerResponse from "../Interface/IServerResponse";
import { NewsCommentModel } from "../Models/NewsCommentModels";
import { NewsLikesModel, NewsModel } from "../Models/NewsModels";
import { NewsReducerTypes } from "../Types/NewsTypes";
import { PageReducerTypes } from "../Types/PageTypes";

const setNewsDataTable = () => async (dispatch: Dispatch<NewsReducerTypes>) => {
  try {
    dispatch({
      type: "fetch_news_table",
      fetch_news_table: true,
    });
    const response: IServerResponse = await NewsApi.getNewsDataTable();

    if (response.success) {
      dispatch({
        type: "news_table",
        news_table: response.data,
      });
    }

    dispatch({
      type: "fetch_news_table",
      fetch_news_table: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const setSingleNews = (news_pk: number) => async (
  dispatch: Dispatch<NewsReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_single_news",
      fetch_single_news: true,
    });
    const response: IServerResponse = await NewsApi.getSingleNews(news_pk);

    if (response.success) {
      dispatch({
        type: "single_news",
        single_news: response.data,
      });
    }

    dispatch({
      type: "fetch_single_news",
      fetch_single_news: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const addNews = (
  payload: FormData,
  successCallback: (msg: string) => any
) => async (dispatch: Dispatch<NewsReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await NewsApi.addNews(payload);
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

const updateNews = (
  payload: NewsModel,
  successCallback: (msg: string) => any
) => async (dispatch: Dispatch<NewsReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await NewsApi.updateNews(payload);
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

const republishNews = (
  news_pk: number,
  successCallback: (msg: string) => any
) => async (dispatch: Dispatch<NewsReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await NewsApi.republishNews(news_pk);
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

const unpublishNews = (
  news_pk: number,
  successCallback: (msg: string) => any
) => async (dispatch: Dispatch<NewsReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await NewsApi.unpublishNews(news_pk);
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

const addNewsComment = (
  payload: NewsCommentModel,
  successCallback: (msg: string) => any
) => async (dispatch: Dispatch<NewsReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await NewsApi.addNewsComment(payload);
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
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

const toggleLike = (
  payload: NewsLikesModel,
  successCallback: () => any
) => async (dispatch: Dispatch<NewsReducerTypes | PageReducerTypes>) => {
  try {
    const response: IServerResponse = await NewsApi.toggleLike(payload);

    if (response.success) {
      if (typeof successCallback === "function") {
        successCallback();
      }
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

const updateNewsReaction = (
  payload: NewsCommentModel,
  successCallback: (msg: string) => any
) => async (dispatch: Dispatch<NewsReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await NewsApi.updateNewsReaction(payload);
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
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export default {
  setNewsDataTable,
  setSingleNews,
  addNews,
  updateNews,
  republishNews,
  unpublishNews,
  addNewsComment,
  updateNewsReaction,
  toggleLike,
};
