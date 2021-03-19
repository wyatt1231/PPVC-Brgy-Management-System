import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { NewsCommentModel } from "../Models/NewsCommentModels";
import { NewsModel } from "../Models/NewsModels";

const API_DEFAULT_ROUTE = `api/news/`;

const getNewsDataTable = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getNewsDataTable",
    null
  );
  return response;
};

const addNews = async (payload: NewsModel): Promise<IServerResponse> => {
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

const updateNewsReaction = async (
  payload: NewsCommentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updateNewsReaction",
    payload
  );
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
};
