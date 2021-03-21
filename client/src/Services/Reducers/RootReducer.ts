import { combineReducers } from "redux";

import UserReducer from "./UserReducer";
import PageReducer from "./PageReducer";
import AdminReducer from "./AdminReducer";
import ResidentReducer from "./ResidentReducer";
import BrgyOfficialReducer from "./BrgyOfficialReducer";
import NewsReducer from "./NewsReducer";
import ComplaintReducer from "./ComplaintReducer";

const RootReducer = combineReducers({
  UserReducer,
  PageReducer,
  AdminReducer,
  ResidentReducer,
  BrgyOfficialReducer,
  NewsReducer,
  ComplaintReducer,
});

export default RootReducer;
