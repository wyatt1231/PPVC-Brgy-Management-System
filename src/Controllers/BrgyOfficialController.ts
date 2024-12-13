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
      try {
        const payload: PaginationModel = req.body;
        res.json(
          await BarangayOfficialRepository.getBrgyOfficialDataTable(payload)
        );
      } catch (error) {
        res.json(500);
      }
    }
  );
  router.post(
    "/getBrgyOfficialList",
    Authorize("admin,resident"),
    async (req: Request, res: Response) => {
      try {
        res.json(await BarangayOfficialRepository.getBrgyOfficialList());
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/addBarangayOfficial",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: BarangayOfficialModel = req.body;
        res.json(
          await BarangayOfficialRepository.addBarangayOfficial(
            payload,
            req.user_pk
          )
        );
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/removeBarangayOfficial",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const official_pk: string = req.body?.official_pk;
        res.json(
          await BarangayOfficialRepository.removeBarangayOfficial(official_pk)
        );
      } catch (error) {
        res.json(500);
      }
    }
  );

  app.use("/api/official/", router);
};

export default BrgyOfficialController;
