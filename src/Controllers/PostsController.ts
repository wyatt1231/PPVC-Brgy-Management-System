import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { PostReactionModel } from "../Models/PostReactionModel";
import { PostsCommentModel } from "../Models/PostsCommentModel";
import { PostsModel } from "../Models/PostsModel";
import { UserClaims } from "../Models/UserModels";
import PostsRepository from "../Repositories/PostsRepository";

const PostsController = async (app: Express): Promise<void> => {
  const router = Router();

<<<<<<< HEAD
=======
  router.post(
    "/getPosts",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await PostsRepository.getPosts());
    }
  );
  router.post(
    "/getUserPosts",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await PostsRepository.getUserPosts(req.user_pk));
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
      let files = req.files?.uploaded_files ? req.files?.uploaded_files : [];

      res.json(
        await PostsRepository.addPosts(
          payload,
          files instanceof Array ? files : [files],
          req.user_pk
        )
      );
    }
  );

  router.post(
    "/getPostsReaction",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await PostsRepository.getPostsReaction());
    }
  );
  router.post(
    "/addPostComment",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PostsCommentModel = req.body;
      res.json(await PostsRepository.addPostComment(payload, req.user_pk));
    }
  );
  router.post(
    "/addPostReaction",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PostReactionModel = req.body;
      console.log(`sdasd payload`, payload);

      res.json(await PostsRepository.addPostReaction(payload, req.user_pk));
    }
  );

>>>>>>> ca47e1e77b938248fafacbc2f5e2845758c51c91
  //reactions

  router.post(
    "/getPostsAdmin",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await PostsRepository.getPostsAdmin());
    }
  );

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
