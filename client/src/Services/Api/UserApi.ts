import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { UserLogin } from "../Models/UserModels";

const API_DEFAULT_ROUTE = `api/user/`;

export const CurrentUserApi = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "currentUser", null);
  console.log(`repsonse`, response);
  return response;
};

export const LoginApi = async (
  payload: UserLogin
): Promise<IServerResponse> => {
  console.log(`payload`);
  const response = await PostFetch(API_DEFAULT_ROUTE + "login", payload);
  return response;
};
