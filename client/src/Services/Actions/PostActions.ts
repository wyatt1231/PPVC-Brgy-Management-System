import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import PostApi from "../Api/PostApi";
import IServerResponse from "../Interface/IServerResponse";
import {
  PaginationModel,
  ScrollPaginationModel,
} from "../Models/PaginationModels";
import { PostsModel } from "../Models/PostModels";
import { PageReducerTypes } from "../Types/PageTypes";
import { PostReducerTypes } from "../Types/PostTypes";

const setPosts =
  (payload: PaginationModel) =>
  async (dispatch: Dispatch<PostReducerTypes>) => {
    try {
      dispatch({
        type: "fetch_posts",
        fetch_posts: true,
      });
      const response: IServerResponse = await PostApi.getPosts(payload);

      if (response.success) {
        dispatch({
          type: "posts",
          posts: response.data.table,
        });
        dispatch({
          type: "posts_table_has_more",
          posts_table_has_more: response.data.has_more,
        });
      }

      dispatch({
        type: "fetch_posts",
        fetch_posts: false,
      });
    } catch (error) {
      console.error(`action error`, error);
    }
  };

const updatePostStatus =
  (payload: PostsModel, successCallback: (msg: string) => any) =>
  async (dispatch: Dispatch<PostReducerTypes | PageReducerTypes>) => {
    try {
      dispatch({
        type: "SET_PAGE_LOADING",
        page_loading: {
          loading_message: "Updating post status, please wait...",
          show: true,
        },
      });
      const response: IServerResponse = await PostApi.updatePostStatus(payload);
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
  setPosts,
  updatePostStatus,
};
