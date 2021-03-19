import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { PostReactionModel } from "../Models/PostReactionModel";
import { PostsCommentModel } from "../Models/PostsCommentModel";
import { PostsModel } from "../Models/PostsModel";
import { UserClaims } from "../Models/UserModels";
import PostsRepository from "../Repositories/PostsRepository";

const PostsController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getPosts",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await PostsRepository.getPosts());
      } catch (error) {
        res.json(error);
      }
    }
  );
  router.post(
    "/getUserPosts",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await PostsRepository.getUserPosts(req.user_pk));
      } catch (error) {
        res.json(error);
      }
    }
  );
  router.post(
    "/getPostsComments",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const posts_pk: string = req.body.posts_pk;
        res.json(await PostsRepository.getPostsComments(posts_pk));
      } catch (error) {
        res.json(error);
      }
    }
  );
  router.post(
    "/addPosts",
    Authorize("admin,resident"),
    async (req: Request & { files: any } & UserClaims, res: Response) => {
      const payload: PostsModel = req.body;
      const files = req.files?.uploaded_files ? req.files?.uploaded_files : [];

      res.json(await PostsRepository.addPosts(payload, files, req.user_pk));
    }
  );

  router.post(
    "/getPostsReaction",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await PostsRepository.getPostsReaction());
      } catch (error) {
        res.json(error);
      }
    }
  );
  router.post(
    "/addPostComment",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PostsCommentModel = req.body;
      try {
        res.json(await PostsRepository.addPostComment(payload,req.user_pk));
      } catch (error) {
        res.json(error);
      }
    }
  );
  router.post(
    "/addPostReaction",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PostReactionModel = req.body;
 
        res.json(await PostsRepository.addPostReaction(payload, req.user_pk));
  
    }
  );
  app.use("/api/posts/", router);
};

export default PostsController;