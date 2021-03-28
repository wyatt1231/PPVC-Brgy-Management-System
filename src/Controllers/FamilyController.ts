import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { FamilyModel } from "../Models/FamilyModel";
import { UserClaims } from "../Models/UserModels";
import FamilyRepository from "../Repositories/FamilyRepository";

const FamilyController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/addFamily",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: FamilyModel = req.body;
      payload.encoded_by = req.user_pk;
      res.json(await FamilyRepository.addFamily(payload));
    }
  );

  router.post(
    "/getSingleFamily",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const ulo_pamilya: number = req.body.ulo_pamilya;
      res.json(await FamilyRepository.getSingleFamily(ulo_pamilya));
    }
  );

  app.use("/api/family/", router);
};

export default FamilyController;
