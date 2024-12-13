import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { PostReactionModel } from "../Models/PostReactionModel";
import { PostsCommentModel } from "../Models/PostsCommentModel";
import { PostsModel } from "../Models/PostsModel";
import { UserClaims } from "../Models/UserModels";
import PostsMobileRepository from "../Repositories/PostMobileReporsitory";

const PostsController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getPosts",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const offset: number = req.body.offset;
      res.json(await PostsMobileRepository.getPosts(req.user_pk,offset));
    }
  );
  router.post(
    "/getreactions",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const posts_pk: number = req.body.posts_pk;
      res.json(await PostsMobileRepository.getreactions(posts_pk, req.user_pk));
    }
  );
  router.post(
    "/getUserPosts",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await PostsMobileRepository.getUserPosts(req.user_pk));
    }
  );
  router.post(
    "/getSinglePostWithPhoto",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const posts_pk: string = req.body.posts_pk;
      res.json(
        await PostsMobileRepository.getSinglePostWithPhoto(
          posts_pk,
          req.user_pk
        )
      );
    }
  );
  router.post(
    "/getPostsComments",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const posts_pk: string = req.body.posts_pk;
        res.json(await PostsMobileRepository.getPostsComments(posts_pk));
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
        await PostsMobileRepository.addPosts(
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
      res.json(await PostsMobileRepository.getPostsReaction());
    }
  );
  router.post(
    "/addPostComment",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PostsCommentModel = req.body;
      res.json(
        await PostsMobileRepository.addPostComment(payload, req.user_pk)
      );
    }
  );
  router.post(
    "/addPostReaction",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PostReactionModel = req.body;
      console.log(`sdasd payload`, payload);

      res.json(
        await PostsMobileRepository.addPostReaction(payload, req.user_pk)
      );
    }
  );

  app.use("/api/postsMobile/", router);
};

export default PostsController;
