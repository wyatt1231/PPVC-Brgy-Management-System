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

    case "news_table_has_more": {
      return {
        ...state,
        news_table_has_more: action.news_table_has_more,
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
    //
    case "news_latest": {
      return {
        ...state,
        news_latest: action.news_latest,
      };
    }
    case "fetch_news_latest": {
      return {
        ...state,
        fetch_news_latest: action.fetch_news_latest,
      };
    }
    //
    default:
      return state;
  }
};

export default NewsReducer;
