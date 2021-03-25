import { PostsModel } from "../Models/PostModels";

export type PostReducerTypes =
  | {
      type: "posts";
      posts: Array<PostsModel>;
    }
  | {
      type: "fetch_posts";
      fetch_posts: boolean;
    };

export interface PostReducerModel {
  posts?: Array<PostsModel>;
  fetch_posts?: boolean;
}
