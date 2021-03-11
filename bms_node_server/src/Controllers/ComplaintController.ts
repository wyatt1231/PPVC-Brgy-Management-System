import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { ComplaintLogModel } from "../Models/ComplaintLogModels";
import { ComplaintMessageModel } from "../Models/ComplaintMessageModels";
import { ComplaintModel } from "../Models/ComplaintModels";
import { UserClaims } from "../Models/UserModels";
import ComplaintRepository from "../Repositories/ComplaintRepository";

const ComplaintController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/addComplaint",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ComplaintModel = req.body;
      res.json(await ComplaintRepository.addComplaint(payload, req.user_pk));
    }
  );

  router.post(
    "/updateComplaint",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ComplaintModel = req.body;
      res.json(await ComplaintRepository.updateComplaint(payload, req.user_pk));
    }
  );

  router.post(
    "/getSingleComplaint",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const complaint_pk: string = req.body.complaint_pk;
      res.json(await ComplaintRepository.getSingleComplaint(complaint_pk));
    }
  );
  router.post(
    "/getComplaintList",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await ComplaintRepository.getComplaintList());
    }
  );

  router.post(
    "/addComplaintLog",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ComplaintLogModel = req.body;
      res.json(await ComplaintRepository.addComplaintLog(payload, req.user_pk));
    }
  );

  router.post(
    "/addComplaintMessage",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ComplaintMessageModel = req.body;
      res.json(
        await ComplaintRepository.addComplaintMessage(payload, req.user_pk)
      );
    }
  );

  app.use("/api/complaint/", router);
};

export default ComplaintController;
