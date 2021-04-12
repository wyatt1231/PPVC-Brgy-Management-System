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
    async (req: Request & UserClaims, res: Response) => {
      const payload: AdministratorModel = req.body;
      res.json(await ResidentMobileRepository.addMobileResident(payload));
    }
  );
router.post(
    "/getresidents",
    async (req: Request & UserClaims, res: Response) => {
      const search: string = req.body.search;
      res.json(await ResidentMobileRepository.getresidents(search));
    }
  );
  
  app.use("/api/residentmobile/", router);
};

export default ResidentMobileController;