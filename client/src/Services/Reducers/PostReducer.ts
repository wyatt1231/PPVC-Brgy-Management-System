import { PostReducerModel, PostReducerTypes } from "../Types/PostTypes";

const defaultState: PostReducerModel = {};

const PostReducer = (
  state: PostReducerModel = defaultState,
  action: PostReducerTypes
): PostReducerModel => {
  switch (action.type) {
    case "posts": {
      return {
        ...state,
        posts: action.posts,
      };
    }
    case "fetch_posts": {
      return {
        ...state,
        fetch_posts: action.fetch_posts,
      };
    }

    case "posts_table_has_more": {
      return {
        ...state,
        posts_table_has_more: action.posts_table_has_more,
      };
    }

    default:
      return state;
  }
};

export default PostReducer;
