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
      const payload: FamilyModel = req.body;
      payload.encoded_by = req.user_pk;
      res.json(await FamilyRepository.addFamily(payload, req.user_pk));
    }
  );

  router.post(
    "/updateFamily",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: FamilyModel = req.body;
      payload.encoded_by = req.user_pk;
      res.json(await FamilyRepository.updateFamily(payload, req.user_pk));
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

  router.post(
    "/getSingleFamByFamPk",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const fam_pk: number = req.body.fam_pk;
      res.json(await FamilyRepository.getSingleFamByFamPk(fam_pk));
    }
  );

  router.post(
    "/getFamilyOfResident",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const resident_pk: number = req.body.resident_pk;
      res.json(await FamilyRepository.getFamilyOfResident(resident_pk));
    }
  );

  router.post(
    "/getFamilyDataTable",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(await FamilyRepository.getFamilyDataTable(payload));
    }
  );

  router.post(
    "/searchNoFamResident",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const search: string = req.body.value;
      res.json(await FamilyRepository.searchNoFamResident(search));
    }
  );

  router.post(
    "/searchFamMember",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: string = req.body;
      res.json(await FamilyRepository.searchFamMember(payload));
    }
  );

  app.use("/api/family/", router);
};

export default FamilyController;
