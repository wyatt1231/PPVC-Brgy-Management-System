import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { BarangayOfficialModel } from "../Models/BarangayOfficialModels";
import { PaginationModel } from "../Models/PaginationModels";

const API_DEFAULT_ROUTE = `api/official/`;

const getBrgyOfficialDataTableApi = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getBrgyOfficialDataTable",
    payload
  );

  console.log(`response`, response);
  return response;
};

const addBarangayOfficialApi = async (
  payload: BarangayOfficialModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addBarangayOfficial",
    payload
  );
  return response;
};

export default {
  getBrgyOfficialDataTableApi,
  addBarangayOfficialApi,
};
