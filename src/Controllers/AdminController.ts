import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { AdministratorModel } from "../Models/AdministratorModels";
import { PaginationModel } from "../Models/PaginationModel";
import { UserClaims } from "../Models/UserModels";
import AdminRepository from "../Repositories/AdminRepository";

const AdminController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getAdminDataTable",
    Authorize("admin"),
    async (req: Request, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(await AdminRepository.getAdminDataTable(payload));
    }
  );

  router.post(
    "/addAdmin",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: AdministratorModel = req.body;
      res.json(await AdminRepository.addAdmin(payload, req.user_pk));
    }
  );

  router.post(
    "/updateAdmin",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: AdministratorModel = req.body;
      res.json(await AdminRepository.updateAdmin(payload, req.user_pk));
    }
  );

  router.post(
    "/getSingleAdmin",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const admin_pk: string = req.body.admin_pk;
      res.json(await AdminRepository.getSingleAdmin(admin_pk));
    }
  );

  app.use("/api/admin/", router);
};

export default AdminController;
