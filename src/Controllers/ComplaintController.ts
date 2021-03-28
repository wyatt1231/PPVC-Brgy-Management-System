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
    "/updateComplaint",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ComplaintModel = req.body;
      res.json(await ComplaintRepository.updateComplaint(payload));
    }
  );
  router.post(
    "/getSingleComplaint",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const complaint_pk: number = req.body.complaint_pk;
      res.json(await ComplaintRepository.getSingleComplaint(complaint_pk));
    }
  );

  router.post(
    "/getComplaintTable",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await ComplaintRepository.getComplaintTable());
    }
  );

  // LOGS
  router.post(
    "/addComplaintLog",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ComplaintLogModel = req.body;
      res.json(await ComplaintRepository.addComplaintLog(payload, req.user_pk));
    }
  );

  router.post(
    "/getComplaintLogTable",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const complaint_pk: number = req.body.complaint_pk;
      res.json(await ComplaintRepository.getComplaintLogTable(complaint_pk));
    }
  );

  //MESSAGES
  router.post(
    "/addComplaintMessage",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ComplaintMessageModel = req.body;
      payload.sent_by = req.user_pk;
      res.json(await ComplaintRepository.addComplaintMessage(payload));
    }
  );

  router.post(
    "/getComplaintMessage",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const complaint_pk: number = req.body.complaint_pk;
      res.json(await ComplaintRepository.getComplaintMessage(complaint_pk));
    }
  );

  app.use("/api/complaint/", router);
};

export default ComplaintController;
