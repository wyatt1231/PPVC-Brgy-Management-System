import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { PostReactionModel } from "../Models/PostReactionModel";
import { PostsCommentModel } from "../Models/PostsCommentModel";
import { PostsModel } from "../Models/PostsModel";
import { UserClaims } from "../Models/UserModels";
import PostsRepository from "../Repositories/PostsRepository";

const PostsController = async (app: Express): Promise<void> => {
  const router = Router();

  //reactions
  router.post(
    "/getPostReactionsAdmin",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const posts_pk: number = req.body.posts_pk;
      res.json(await PostsRepository.getPostReactionsAdmin(posts_pk));
    }
  );

  //comments
  router.post(
    "/getPostCommentsAdmin",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const posts_pk: number = req.body.posts_pk;
      res.json(await PostsRepository.getPostCommentsAdmin(posts_pk));
    }
  );

  app.use("/api/posts/", router);
};

export default PostsController;
