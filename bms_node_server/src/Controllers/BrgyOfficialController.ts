import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { BarangayOfficialModel } from "../Models/BarangayOfficialModels";
import { PaginationModel } from "../Models/PaginationModel";
import { UserClaims } from "../Models/UserModels";
import BarangayOfficialRepository from "../Repositories/BarangayOfficialRepository";

const BrgyOfficialController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getBrgyOfficialDataTable",
    Authorize("admin,resident"),
    async (req: Request, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(
        await BarangayOfficialRepository.getBrgyOfficialDataTable(payload)
      );
    }
  );
  router.post(
    "/getBrgyOfficialList",
    Authorize("admin,resident"),
    async (req: Request, res: Response) => {
      res.json(
        await BarangayOfficialRepository.getBrgyOfficialList()
      );
    }
  );

  router.post(
    "/addBarangayOfficial",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: BarangayOfficialModel = req.body;
      res.json(
        await BarangayOfficialRepository.addBarangayOfficial(
          payload,
          req.user_pk
        )
      );
    }
  );

  app.use("/api/official/", router);
};

export default BrgyOfficialController;
