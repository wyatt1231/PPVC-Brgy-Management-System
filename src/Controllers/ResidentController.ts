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
      try {
        const payload: PaginationModel = req.body;
        res.json(await ResidentRepository.getDataTableResident(payload));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/addResident",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: AdministratorModel = req.body;
        res.json(await ResidentRepository.addResident(payload, req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/updateResident",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: AdministratorModel = req.body;
        res.json(await ResidentRepository.updateResident(payload, req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );
  router.post(
    "/toggleResidentStatus",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const resident_pk: number = req.body.resident_pk;
        res.json(await ResidentRepository.toggleResidentStatus(resident_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/getSingleResident",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const resident_pk: string = req.body.resident_pk;
        res.json(await ResidentRepository.getSingleResident(resident_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/searchResident",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const search: string = req.body.value;
        res.json(await ResidentRepository.searchResident(search));
      } catch (error) {
        res.json(500);
      }
    }
  );

  app.use("/api/resident/", router);
};

export default ResidentController;
