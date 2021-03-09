import { NewsReducerModel, NewsReducerTypes } from "../Types/NewsTypes";

const defaultState: NewsReducerModel = {
  fetching_news_data_table: false,
  fetching_selected_news: false,
};

const NewsReducer = (
  state: NewsReducerModel = defaultState,
  action: NewsReducerTypes
): NewsReducerModel => {
  switch (action.type) {
    case "set_news_data_table": {
      return {
        ...state,
        news_data_table: action.news_data_table,
      };
    }
    case "fetching_news_data_table": {
      return {
        ...state,
        fetching_news_data_table: action.fetching_news_data_table,
      };
    }

    //--

    case "set_selected_news": {
      return {
        ...state,
        selected_news: action.selected_news,
      };
    }
    case "fetching_selected_news": {
      return {
        ...state,
        fetching_selected_news: action.fetching_selected_news,
      };
    }

    default:
      return state;
  }
};

export default NewsReducer;
