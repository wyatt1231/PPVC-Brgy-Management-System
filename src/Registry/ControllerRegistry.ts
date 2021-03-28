import { Express } from "express";
import AdminController from "../Controllers/AdminController";
import BrgyOfficialController from "../Controllers/BrgyOfficialController";
import ComplaintController from "../Controllers/ComplaintController";
import DashboardController from "../Controllers/DashboardController";
import NewsController from "../Controllers/NewsController";
import ResidentController from "../Controllers/ResidentController";
import UserController from "../Controllers/UserController";
import PostsController from "../Controllers/PostsController";
import FamilyController from "../Controllers/FamilyController";

export const ControllerRegistry = async (app: Express) => {
  await UserController(app);
  await AdminController(app);
  await ResidentController(app);
  await NewsController(app);
  await ComplaintController(app);
  await BrgyOfficialController(app);
  await DashboardController(app);
  await PostsController(app);
  await FamilyController(app);
};

export default ControllerRegistry;
