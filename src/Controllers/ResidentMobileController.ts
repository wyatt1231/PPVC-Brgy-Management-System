import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { AdministratorModel } from "../Models/AdministratorModels";
import { PaginationModel } from "../Models/PaginationModel";
import { UserClaims } from "../Models/UserModels";
import ResidentMobileRepository from "../Repositories/ResidentMobileRepository";

const ResidentMobileController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/addMobileResident",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: AdministratorModel = req.body;
      res.json(await ResidentMobileRepository.addMobileResident(payload));
    }
  );
  router.post(
    "/getresidents",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const search: string = req.body.search;
      res.json(await ResidentMobileRepository.getresidents(search));
    }
  );
  router.post(
    "/getmembers",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const resident_pk: string = req.body.resident_pk;
      res.json(await ResidentMobileRepository.getmembers(resident_pk));
    }
  );
  router.post(
    "/getreligion",
    async (req: Request & UserClaims, res: Response) => {
      res.json(await ResidentMobileRepository.getreligion());
    }
  );
  router.post(
    "/getnationality",
    async (req: Request & UserClaims, res: Response) => {
      res.json(await ResidentMobileRepository.getnationality());
    }
  );
  router.post(
    "/upadatenewuser",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const user_pk: number = req.body.user_pk;
      res.json(await ResidentMobileRepository.upadatenewuser(user_pk));
    }
  );

  app.use("/api/residentmobile/", router);
};

export default ResidentMobileController;
