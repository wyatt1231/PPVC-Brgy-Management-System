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
    async (req: Request & { files: any } & UserClaims, res: Response) => {
      const payload: ComplaintModel = req.body;
      payload.reported_by = req.user_pk;

      let files = req.files?.uploaded_files ? req.files?.uploaded_files : [];

      res.json(
        await ComplaintRepository.addComplaint(
          payload,
          files instanceof Array ? files : [files]
        )
      );
    }
  );

  router.post(
    "/updateComplaint",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ComplaintModel = req.body;
      res.json(await ComplaintRepository.updateComplaint(payload));
    }
  );
  router.post(
    "/getComplaintList",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const reported_by: string = req.body.reported_by;
      res.json(await ComplaintRepository.getComplaintList(reported_by));
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
      const reported_by: string = req.body.reported_by;
      res.json(await ComplaintRepository.getComplaintTable(reported_by));
    }
  );
  router.post(
    "/getComplaintList",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const reported_by: string = req.body.reported_by;
      res.json(await ComplaintRepository.getComplaintList(reported_by));
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
