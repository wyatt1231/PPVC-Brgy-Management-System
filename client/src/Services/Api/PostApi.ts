import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { PostCommentModel, PostReactionModel } from "../Models/PostModels";

const API_DEFAULT_ROUTE = `api/posts/`;

//posts
const getPosts = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getPosts", null);
  return response;
};

const addPosts = async (payload: FormData): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "addPosts", payload);
  return response;
};

//reactions

const getPostReactionsAdmin = async (
  posts_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getPostReactionsAdmin",
    {
      posts_pk: posts_pk,
    }
  );
  return response;
};

const addPostReaction = async (
  payload: PostReactionModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addPostReaction",
    payload
  );
  return response;
};

//comments
const getPostCommentsAdmin = async (
  posts_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getPostCommentsAdmin", {
    posts_pk: posts_pk,
  });
  return response;
};

const addPostComment = async (
  payload: PostCommentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addPostReaction",
    payload
  );
  return response;
};

export default {
  getPosts,
  addPosts,
  getPostReactionsAdmin,
  addPostReaction,
  getPostCommentsAdmin,
  addPostComment,
};
