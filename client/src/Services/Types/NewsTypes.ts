import { NewsModel } from "../Models/NewsModels";

export type NewsReducerTypes =
  | {
      type: "news_table";
      news_table: Array<NewsModel>;
    }
  | {
      type: "fetch_news_table";
      fetch_news_table: boolean;
    }
  | {
      type: "single_news";
      single_news: NewsModel;
    }
  | {
      type: "fetch_single_news";
      fetch_single_news: boolean;
    };

export interface NewsReducerModel {
  news_table?: Array<NewsModel>;
  fetch_news_table?: boolean;
  single_news?: NewsModel;
  fetch_single_news?: boolean;
}
