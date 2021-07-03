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
        const purok: Array<string> = req.body;
        res.json(await DashboardRepository.overallPopulation(purok));
      } catch (error) {
        res.json(error);
      }
    }
  );

  router.post(
    "/ageGroupStats",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const purok: Array<string> = req.body;
      try {
        res.json(await DashboardRepository.ageGroupStats(purok));
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
        const purok: Array<string> = req.body;
        res.json(await DashboardRepository.genderStats(purok));
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
        const purok: Array<string> = req.body;
        res.json(await DashboardRepository.lifeStageStats(purok));
      } catch (error) {
        res.json(error);
      }
    }
  );

  router.post(
    "/statsComplaint",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.statsComplaint());
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/statsNews",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.statsNews());
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/total_population",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const purok: Array<string> = req.body;
        res.json(await DashboardRepository.total_population(purok));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/total_death",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const purok: Array<string> = req.body;
        res.json(await DashboardRepository.total_death(purok));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/total_pwd",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const purok: Array<string> = req.body;
        res.json(await DashboardRepository.total_pwd(purok));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/total_sc",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const purok: Array<string> = req.body;
        res.json(await DashboardRepository.total_sc(purok));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/StatsPasilidadKuryente",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.StatsPasilidadKuryente());
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/StatsBiktikmaPangabuso",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.StatsBiktikmaPangabuso());
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/StatsKahimtangKomunidad",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.StatsKahimtangKomunidad());
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/StatsMatangBasura",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.StatsMatangBasura());
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/StatsMatangKasilyas",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await DashboardRepository.StatsMatangKasilyas());
      } catch (error) {
        res.json(500);
      }
    }
  );

  app.use("/api/dashboard/", router);
};

export default DashboardController;
