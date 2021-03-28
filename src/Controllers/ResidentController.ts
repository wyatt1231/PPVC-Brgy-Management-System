import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { AdministratorModel } from "../Models/AdministratorModels";
import { PaginationModel } from "../Models/PaginationModel";
import { UserClaims } from "../Models/UserModels";
import ResidentRepository from "../Repositories/ResidentRepository";

const ResidentController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getDataTableResident",
    Authorize("admin,resident"),
    async (req: Request, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(await ResidentRepository.getDataTableResident(payload));
    }
  );

  router.post(
    "/addResident",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: AdministratorModel = req.body;
      res.json(await ResidentRepository.addResident(payload, req.user_pk));
    }
  );

  router.post(
    "/updateResident",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: AdministratorModel = req.body;
      res.json(await ResidentRepository.updateResident(payload, req.user_pk));
    }
  );

  router.post(
    "/getSingleResident",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const resident_pk: string = req.body.resident_pk;
      res.json(await ResidentRepository.getSingleResident(resident_pk));
    }
  );

  router.post(
    "/searchResident",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const search: string = req.body.value;
      res.json(await ResidentRepository.searchResident(search));
    }
  );

  app.use("/api/resident/", router);
};

export default ResidentController;
