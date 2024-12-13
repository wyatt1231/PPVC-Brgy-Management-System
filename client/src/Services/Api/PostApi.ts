import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import {
  PostCommentModel,
  PostReactionModel,
  PostsModel,
} from "../Models/PostModels";

const API_DEFAULT_ROUTE = `api/posts/`;

//posts
const getPosts = async (payload: PaginationModel): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getPostsAdmin",
    payload
  );
  return response;
};

const addPosts = async (payload: FormData): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "addPosts", payload);
  return response;
};

const updatePostStatus = async (
  payload: PostsModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updatePostStatus",
    payload
  );
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
    API_DEFAULT_ROUTE + "addPostComment",
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
  updatePostStatus,
};
