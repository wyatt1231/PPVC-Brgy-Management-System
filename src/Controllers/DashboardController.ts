import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { UserClaims } from "../Models/UserModels";
import DashboardRepository from "../Repositories/DashboardRepository";

const DashboardController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/overallPopulation",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.overallPopulation());
      } catch (error) {
        res.json(error);
      }
    }
  );

  router.post(
    "/ageGroupStats",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.ageGroupStats());
      } catch (error) {
        res.json(error);
      }
    }
  );

  router.post(
    "/genderStats",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.genderStats());
      } catch (error) {
        res.json(error);
      }
    }
  );

  router.post(
    "/lifeStageStats",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.lifeStageStats());
      } catch (error) {
        res.json(error);
      }
    }
  );

  app.use("/api/dashboard/", router);
};

export default DashboardController;
