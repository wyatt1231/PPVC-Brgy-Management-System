import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { ResidentModel } from "../Models/ResidentModels";

const API_DEFAULT_ROUTE = `api/resident/`;

const getResidentDataTableApi = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getDataTableResident",
    payload
  );
  return response;
};

const getDataTableResidentPdf = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getDataTableResidentPdf",
    payload
  );
  return response;
};

const addResidentApi = async (
  payload: ResidentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "addResident", payload);
  return response;
};

const updateResidentApi = async (
  payload: ResidentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updateResident",
    payload
  );
  return response;
};

const toggleResidentStatus = async (
  resident_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "toggleResidentStatus", {
    resident_pk,
  });
  return response;
};

const getSingleResident = async (
  resident_pk: string | number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getSingleResident", {
    resident_pk: resident_pk,
  });
  return response;
};

export default {
  getResidentDataTableApi,
  getDataTableResidentPdf,
  addResidentApi,
  updateResidentApi,
  getSingleResident,
  toggleResidentStatus,
};
