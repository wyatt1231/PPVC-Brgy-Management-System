import { NewsReducerModel, NewsReducerTypes } from "../Types/NewsTypes";

const defaultState: NewsReducerModel = {};

const NewsReducer = (
  state: NewsReducerModel = defaultState,
  action: NewsReducerTypes
): NewsReducerModel => {
  switch (action.type) {
    case "news_table": {
      return {
        ...state,
        news_table: action.news_table,
      };
    }
    case "fetch_news_table": {
      return {
        ...state,
        fetch_news_table: action.fetch_news_table,
      };
    }

    case "single_news": {
      return {
        ...state,
        single_news: action.single_news,
      };
    }
    case "fetch_single_news": {
      return {
        ...state,
        fetch_single_news: action.fetch_single_news,
      };
    }

    default:
      return state;
  }
};

export default NewsReducer;
