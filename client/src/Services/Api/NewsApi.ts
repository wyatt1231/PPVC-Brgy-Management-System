import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { NewsCommentModel } from "../Models/NewsCommentModels";
import { NewsLikesModel, NewsModel } from "../Models/NewsModels";
import { ScrollPaginationModel } from "../Models/PaginationModels";

const API_DEFAULT_ROUTE = `api/news/`;

const getNewsDataTable = async (
  payload: ScrollPaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getNewsDataTable",
    payload
  );
  return response;
};

const addNews = async (payload: FormData): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "addNews", payload);
  return response;
};

const updateNews = async (payload: NewsModel): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "updateNews", payload);
  return response;
};

const republishNews = async (news_pk: number): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "republishNews", {
    news_pk,
  });
  return response;
};

const unpublishNews = async (news_pk: number): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "unpublishNews", {
    news_pk,
  });
  return response;
};

const getSingleNews = async (news_pk: number): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getSingleNews", {
    news_pk,
  });
  return response;
};

const getNewsFiles = async (news_pk: number): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getNewsFiles", {
    news_pk,
  });
  return response;
};

const addNewsComment = async (
  payload: NewsCommentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addNewsComment",
    payload
  );
  return response;
};

const addNewsReaction = async (
  payload: NewsCommentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addNewsReaction",
    payload
  );
  return response;
};

const toggleLike = async (
  payload: NewsLikesModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "toggleLike", payload);
  return response;
};

const updateNewsReaction = async (
  payload: NewsCommentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updateNewsReaction",
    payload
  );
  return response;
};

const getNewsLatest = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getNewsLatest", {});
  return response;
};

export default {
  getNewsDataTable,
  addNews,
  updateNews,
  republishNews,
  unpublishNews,
  getSingleNews,
  addNewsComment,
  addNewsReaction,
  updateNewsReaction,
  toggleLike,
  getNewsFiles,
  getNewsLatest,
};
