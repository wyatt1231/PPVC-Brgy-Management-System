import { combineReducers } from "redux";

import UserReducer from "./UserReducer";
import PageReducer from "./PageReducer";
import AdminReducer from "./AdminReducer";
import ResidentReducer from "./ResidentReducer";
import BrgyOfficialReducer from "./BrgyOfficialReducer";
import NewsReducer from "./NewsReducer";

const RootReducer = combineReducers({
  UserReducer,
  PageReducer,
  AdminReducer,
  ResidentReducer,
  BrgyOfficialReducer,
  NewsReducer,
});

export default RootReducer;
