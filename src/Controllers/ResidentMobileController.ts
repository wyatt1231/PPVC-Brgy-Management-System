import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { AdministratorModel } from "../Models/AdministratorModels";
import { PaginationModel } from "../Models/PaginationModel";
import { ForgotPass, SearchResident } from "../Models/ResidentModels";
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
      const searchname: string = req.body.searchname;
      res.json(await ResidentMobileRepository.getresidents(searchname));
    }
  );
router.post(
    "/updatepassword",
    async (req: Request & UserClaims, res: Response) => {
      const payload: ForgotPass = req.body;
      res.json(await ResidentMobileRepository.resetpassword(payload));
    }
  );
router.post(
    "/forgotpassword",
    async (req: Request & UserClaims, res: Response) => {
      const payload: ForgotPass = req.body;
      res.json(await ResidentMobileRepository.forgotpassword(payload));
    }
  );
  app.use("/api/residentmobile/", router);
};

export default ResidentMobileController;