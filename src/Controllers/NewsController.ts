import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { NewsCommentModel } from "../Models/NewsCommentModels";
import { NewsFileModel } from "../Models/NewsFileModel";
import { NewsLikesModel, NewsModel } from "../Models/NewsModels";
import { NewsReactionModel } from "../Models/NewsReactionModels";
import {
  PaginationModel,
  ScrollPaginationModel,
} from "../Models/PaginationModel";
import { UserClaims } from "../Models/UserModels";
import NewsRepository from "../Repositories/NewsRepository";

const NewsController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getNewsComments",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const news_pk: string = req.body.news_pk;
        res.json(await NewsRepository.getNewsComments(news_pk));
      } catch (error) {
        res.json(error);
      }
    }
  );
  router.post(
    "/getNewsDataTable",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: PaginationModel = req.body;
        res.json(await NewsRepository.getNewsDataTable(payload));
      } catch (error) {
        res.json(error);
      }
    }
  );

  router.post(
    "/getNewsFiles",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: number = req.body.news_pk;
        res.json(await NewsRepository.getNewsFiles(payload));
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
        res.json(await NewsRepository.getNewsDataPublished());
      } catch (error) {
        res.json(error);
      }
    }
  );
  router.post(
    "/addNews",
    Authorize("admin"),
    async (req: Request & { files: any } & UserClaims, res: Response) => {
      try {
        const payload: NewsModel = req.body;
        let files = req.files?.uploaded_files ? req.files?.uploaded_files : [];

        if (files instanceof Array) {
        } else {
          files = [files];
        }

        res.json(
          await NewsRepository.addNews(
            payload,
            files instanceof Array ? files : [files],
            req.user_pk
          )
        );
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/addNewsFiles",
    Authorize("admin"),
    async (req: Request & { files: any } & UserClaims, res: Response) => {
      try {
        const payload: NewsModel = req.body;
        let files = req.files?.uploaded_files ? req.files?.uploaded_files : [];

        if (files instanceof Array) {
        } else {
          files = [files];
        }

        res.json(
          await NewsRepository.addNewsFiles(
            payload,
            files instanceof Array ? files : [files],
            req.user_pk
          )
        );
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/updateNews",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: NewsModel = req.body;
        res.json(await NewsRepository.updateNews(payload, req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/republishNews",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const news_pk: number = req.body.news_pk;
        res.json(await NewsRepository.republishNews(news_pk, req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/unpublishNews",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const news_pk: number = req.body.news_pk;
        res.json(await NewsRepository.unpublishNews(news_pk, req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/getSingleNews",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const news_pk: string = req.body.news_pk;
        res.json(await NewsRepository.getSingleNews(news_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );
  router.post(
    "/getSingleNewsWithPhoto",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const news_pk: string = req.body.news_pk;
        res.json(await NewsRepository.getSingleNewsWithPhoto(news_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/addNewsComment",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: NewsCommentModel = req.body;
        res.json(await NewsRepository.addNewsComment(payload, req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/addNewsReaction",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: NewsReactionModel = req.body;
        res.json(await NewsRepository.addNewsReaction(payload, req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/toggleLike",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: NewsLikesModel = {
          ...req.body,
          liked_by: req.user_pk,
        };
        res.json(await NewsRepository.toggleLike(payload));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/updateNewsReaction",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: NewsReactionModel = req.body;
        res.json(await NewsRepository.updateNewsReaction(payload, req.user_pk));
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/getNewsLatest",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        res.json(await NewsRepository.getNewsLatest());
      } catch (error) {
        res.json(500);
      }
    }
  );

  router.post(
    "/deleteNewsFile",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      try {
        const payload: NewsFileModel = req.body;
        res.json(await NewsRepository.deleteNewsFile(payload));
      } catch (error) {
        res.json(500);
      }
    }
  );

  app.use("/api/news/", router);
};

export default NewsController;
