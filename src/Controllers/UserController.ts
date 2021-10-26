import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { UserClaims } from "../Models/UserModels";
import * as user_repo from "../Repositories/UserRepository";

const UserController = async (app: Express): Promise<void> => {
  const router = Router();

  router.get("/test", async (req: Request & UserClaims, res: Response) => {
    res.json("Running");
  });

  router.post("/login", async (req: Request & UserClaims, res: Response) => {
    try {
      res.json(await user_repo.loginUser(req.body));
    } catch (error) {
      res.json(500);
    }
  });

  router.post(
    "/currentUser",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await user_repo.currentUser(req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );
  router.post(
    "/userinfo",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await user_repo.userinfo(req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  app.use("/api/user/", router);
};

export default UserController;
