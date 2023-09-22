import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { ComplaintLogModel } from "../Models/ComplaintLogModels";
import { ComplaintMessageModel } from "../Models/ComplaintMessageModels";
import { ComplaintModel } from "../Models/ComplaintModels";
import { UserClaims } from "../Models/UserModels";
import ComplaintMobileRepository from "../Repositories/ComplaintsMobileRepository";

const ComplaintMobileController = async (app: Express): Promise<void> => {
  const router = Router();
  
router.post(
    "/addComplaintMessage",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ComplaintMessageModel = req.body;
      payload.sent_by = req.user_pk;
      res.json(await ComplaintMobileRepository.addComplaintMessage(payload));
    }
  );  router.post(
    "/getSingleComplaint",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const complaint_pk: number = req.body.complaint_pk;
      res.json(await ComplaintMobileRepository.getSingleComplaint(complaint_pk));
    }
  );

  router.post(
    "/getComplaintMessage",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const complaint_pk: number = req.body.complaint_pk;
      res.json(await ComplaintMobileRepository.getComplaintMessage(complaint_pk));
    }
  );
  router.post(
    "/getComplaintList",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const reported_by: string = req.body.reported_by;
      res.json(await ComplaintMobileRepository.getComplaintList(reported_by));
    }
  );
  router.post(
    "/addComplaint",
    Authorize("admin,resident"),
    async (req: Request & { files: any } & UserClaims, res: Response) => {
      const payload: ComplaintModel = req.body;
      payload.reported_by = req.user_pk;

      let files = req.files?.uploaded_files ? req.files?.uploaded_files : [];

      res.json(
        await ComplaintMobileRepository.addComplaint(
          payload,
          files instanceof Array ? files : [files]
        )
      );
    }
  );
  app.use("/api/complaintmobile/", router);
};

export default ComplaintMobileController;