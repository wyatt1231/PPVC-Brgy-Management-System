import { Dispatch } from "react";
import PostApi from "../Api/PostApi";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { PostReducerTypes } from "../Types/PostTypes";

const setPosts = (payload: PaginationModel) => async (
  dispatch: Dispatch<PostReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_posts",
      fetch_posts: true,
    });
    const response: IServerResponse = await PostApi.getPosts(payload);

    if (response.success) {
      dispatch({
        type: "posts",
        posts: response.data,
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

export default {
  setPosts,
};
