import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { NewsCommentModel } from "../Models/NewsCommentModels";
import { NewsLikesModel, NewsModel } from "../Models/NewsModels";
import { NewsReactionModel } from "../Models/NewsReactionModels";
import { UserClaims } from "../Models/UserModels";
import NewsMobileRepository from "../Repositories/NewsMobileRepository";

const NewsMobileController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getNewsComments",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const news_pk: string = req.body.news_pk;
        res.json(await NewsMobileRepository.getNewsComments(news_pk));
      } catch (error) {
        res.json(error);
      }
    }
  );
  router.post(
    "/getNewsDataPublished",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await NewsMobileRepository.getNewsDataPublished());
      } catch (error) {
        res.json(error);
      }
    }
  );
  router.post(
    "/getNewsDataPublishedByMonth",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const month: number = req.body.month;
        res.json(await NewsMobileRepository.getNewsDataPublishedByMonth(month));
      } catch (error) {
        res.json(error);
      }
    }
  );
  router.post(
    "/getNewsDataPublishedLastWeek",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await NewsMobileRepository.getNewsDataPublishedLastWeek());
      } catch (error) {
        res.json(error);
      }
    }
  );
  router.post(
    "/getSingleNewsWithPhoto",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const news_pk: string = req.body.news_pk;
      res.json(await NewsMobileRepository.getSingleNewsWithPhoto(news_pk));
    }
  );

  router.post(
    "/addNewsComment",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: NewsCommentModel = req.body;
      res.json(await NewsMobileRepository.addNewsComment(payload, req.user_pk));
    }
  );

  router.post(
    "/addNewsReaction",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: NewsReactionModel = req.body;
      res.json(await NewsMobileRepository.addNewsReaction(payload, req.user_pk));
    }
  );

  router.post(
    "/addNews",
    Authorize("admin"),
    async (req: Request & { files: any } & UserClaims, res: Response) => {
      const payload: NewsModel = req.body;
      let files = req.files?.uploaded_files ? req.files?.uploaded_files : [];

      if (files instanceof Array) {
      } else {
        files = [files];
      }

      res.json(
        await NewsMobileRepository.addNews(
          payload,
          files instanceof Array ? files : [files],
          req.user_pk
        )
      );
    }
  );
  
  app.use("/api/newsmobile/", router);
};

export default NewsMobileController;
