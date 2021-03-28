import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { UserClaims } from "../Models/UserModels";
import * as user_repo from "../Repositories/UserRepository";

const UserController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post("/login", async (req: Request & UserClaims, res: Response) => {
    res.json(await user_repo.loginUser(req.body));
  });

  router.post(
    "/currentUser",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await user_repo.currentUser(req.user_pk));
    }
  );
  router.post(
    "/userinfo",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await user_repo.userinfo(req.user_pk));
    }
  );

  app.use("/api/user/", router);
};

export default UserController;
