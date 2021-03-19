import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { NewsCommentModel } from "../Models/NewsCommentModels";
import { NewsModel } from "../Models/NewsModels";

const API_DEFAULT_ROUTE = `api/official/`;

const getNewsDataTableApi = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getNewsDataTable",
    null
  );
  return response;
};

const addNewsApi = async (payload: NewsModel): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "addNews", payload);
  return response;
};

const updateNewsApi = async (payload: NewsModel): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "updateNews", payload);
  return response;
};

const getSingleNewsApi = async (news_pk: number): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getSingleNews", {
    news_pk,
  });
  return response;
};

const addNewsCommentApi = async (
  payload: NewsCommentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addNewsComment",
    payload
  );
  return response;
};

const addNewsReactionApi = async (
  payload: NewsCommentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addNewsReaction",
    payload
  );
  return response;
};

const updateNewsReactionApi = async (
  payload: NewsCommentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updateNewsReaction",
    payload
  );
  return response;
};

export default {
  getNewsDataTableApi,
  addNewsApi,
  updateNewsApi,
  getSingleNewsApi,
  addNewsCommentApi,
  addNewsReactionApi,
  updateNewsReactionApi,
};
