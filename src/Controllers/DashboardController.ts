import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { UserClaims } from "../Models/UserModels";
import DashboardRepository from "../Repositories/DashboardRepository";

const DashboardController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getYearlyPopulationStats",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.getYearlyPopulationStats());
      } catch (error) {
        res.json(error);
      }
    }
  );

  router.post(
    "/getPopulationOfYearStats",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const current_year = req.body.current_year;
      try {
        res.json(
          await DashboardRepository.getPopulationOfYearStats(current_year)
        );
      } catch (error) {
        res.json(error);
      }
    }
  );

  router.post(
    "/getAgeGroupStats",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.getAgeGroupStats());
      } catch (error) {
        res.json(error);
      }
    }
  );

  app.use("/api/dashboard/", router);
};

export default DashboardController;
