import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { FamilyModel } from "../Models/FamilyModel";
import { UserClaims } from "../Models/UserModels";
import FamilyMobileRepository from "../Repositories/FamilyMobileRepository";

const FamilyMobileController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getfamilyexist",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const ulo_pamilya: string = req.body.ulo_pamilya;
      res.json(await FamilyMobileRepository.getfamilyexist(ulo_pamilya));
    }
  );
  app.use("/api/familymobile/", router);
};

export default FamilyMobileController;