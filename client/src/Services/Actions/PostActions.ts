import { Dispatch } from "react";
import PostApi from "../Api/PostApi";
import IServerResponse from "../Interface/IServerResponse";
import { PostReducerTypes } from "../Types/PostTypes";

const setPosts = () => async (dispatch: Dispatch<PostReducerTypes>) => {
  try {
    dispatch({
      type: "fetch_posts",
      fetch_posts: true,
    });
    const response: IServerResponse = await PostApi.getPosts();

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
