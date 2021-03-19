import { NewsModel } from "../Models/NewsModels";

export type NewsReducerTypes =
  | {
      type: "set_news_data_table";
      news_data_table: Array<NewsModel>;
    }
  | {
      type: "fetching_news_data_table";
      fetching_news_data_table: boolean;
    }
  | {
      type: "set_selected_news";
      selected_news: NewsModel;
    }
  | {
      type: "fetching_selected_news";
      fetching_selected_news: boolean;
    };

export interface NewsReducerModel {
  news_data_table?: null | Array<NewsModel>;
  fetching_news_data_table: boolean;
  selected_news?: NewsModel;
  fetching_selected_news: boolean;
}
