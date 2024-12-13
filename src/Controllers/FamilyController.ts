import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { FamilyModel } from "../Models/FamilyModel";
import { PaginationModel } from "../Models/PaginationModel";
import { UserClaims } from "../Models/UserModels";
import FamilyRepository from "../Repositories/FamilyRepository";

const FamilyController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/addFamily",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: FamilyModel = req.body;
        payload.encoded_by = req.user_pk;
        res.json(await FamilyRepository.addFamily(payload, req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/updateFamily",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: FamilyModel = req.body;
        payload.encoded_by = req.user_pk;
        res.json(await FamilyRepository.updateFamily(payload, req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/getSingleFamily",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const ulo_pamilya: number = req.body.ulo_pamilya;
        res.json(await FamilyRepository.getSingleFamily(ulo_pamilya));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/getSingleFamByFamPk",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const fam_pk: number = req.body.fam_pk;
        res.json(await FamilyRepository.getSingleFamByFamPk(fam_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/getFamilyOfResident",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const resident_pk: number = req.body.resident_pk;
        res.json(await FamilyRepository.getFamilyOfResident(resident_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/getFamilyDataTable",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: PaginationModel = req.body;
        res.json(await FamilyRepository.getFamilyDataTable(payload));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/getFamilyDataTablePdf",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: PaginationModel = req.body;
        res.json(await FamilyRepository.getFamilyDataTablePdf(payload));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/searchNoFamResident",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
      } catch (error) {
        res.json(500);
      }
      const search: string = req.body.value;
      res.json(await FamilyRepository.searchNoFamResident(search));
    }
  );

  router.post(
    "/searchFamMember",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
      } catch (error) {
        res.json(500);
      }
      const payload: string = req.body;
      res.json(await FamilyRepository.searchFamMember(payload));
    }
  );

  app.use("/api/family/", router);
};

export default FamilyController;
