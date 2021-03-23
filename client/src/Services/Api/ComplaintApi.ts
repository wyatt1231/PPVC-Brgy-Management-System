import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { ComplaintLogModel } from "../Models/ComplaintLogModels";
import { ComplaintMessageModel } from "../Models/ComplaintMessageModels";

const API_DEFAULT_ROUTE = `api/complaint/`;

const getComplaintTable = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getComplaintTable",
    null
  );
  return response;
};

const getSingleComplaint = async (
  complaint_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getSingleComplaint", {
    complaint_pk: complaint_pk,
  });
  return response;
};

//logs

const addComplaintLog = async (
  payload: ComplaintLogModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addComplaintLog",
    payload
  );
  return response;
};

const getComplaintLogTable = async (
  complaint_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getComplaintLogTable", {
    complaint_pk: complaint_pk,
  });
  return response;
};

//MESSAGES

const getComplaintMessage = async (
  complaint_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getComplaintMessage", {
    complaint_pk: complaint_pk,
  });
  return response;
};

const addComplaintMessage = async (
  payload: ComplaintMessageModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addComplaintMessage",
    payload
  );
  return response;
};

export default {
  getComplaintTable,
  getSingleComplaint,
  addComplaintLog,
  getComplaintLogTable,
  getComplaintMessage,
  addComplaintMessage,
};
