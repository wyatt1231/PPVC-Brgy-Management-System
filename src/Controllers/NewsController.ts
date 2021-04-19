import axios from "axios";
import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { NewsCommentModel } from "../Models/NewsCommentModels";
import { NewsLikesModel, NewsModel } from "../Models/NewsModels";
import { NewsReactionModel } from "../Models/NewsReactionModels";
import qs from "qs";
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
    }
  );

  router.post(
    "/updateNews",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: NewsModel = req.body;
      res.json(await NewsRepository.updateNews(payload, req.user_pk));
    }
  );

  router.post(
    "/republishNews",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const news_pk: number = req.body.news_pk;
      res.json(await NewsRepository.republishNews(news_pk, req.user_pk));
    }
  );

  router.post(
    "/unpublishNews",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const news_pk: number = req.body.news_pk;
      res.json(await NewsRepository.unpublishNews(news_pk, req.user_pk));
    }
  );

  router.post(
    "/getSingleNews",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const news_pk: string = req.body.news_pk;
      res.json(await NewsRepository.getSingleNews(news_pk));
    }
  );
  router.post(
    "/getSingleNewsWithPhoto",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const news_pk: string = req.body.news_pk;
      res.json(await NewsRepository.getSingleNewsWithPhoto(news_pk));
    }
  );

  router.post(
    "/addNewsComment",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: NewsCommentModel = req.body;
      res.json(await NewsRepository.addNewsComment(payload, req.user_pk));
    }
  );

  router.post(
    "/addNewsReaction",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: NewsReactionModel = req.body;
      res.json(await NewsRepository.addNewsReaction(payload, req.user_pk));
    }
  );

  router.post(
    "/toggleLike",
    Authorize("admin,resident"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: NewsLikesModel = {
        ...req.body,
        liked_by: req.user_pk,
      };
      res.json(await NewsRepository.toggleLike(payload));
    }
  );

  router.post(
    "/updateNewsReaction",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: NewsReactionModel = req.body;
      res.json(await NewsRepository.updateNewsReaction(payload, req.user_pk));
    }
  );

  router.post(
    "/getNewsLatest",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await NewsRepository.getNewsLatest());
    }
  );

  router.get(
    "/testSms",
    // Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      console.log(`-------------------`);
      try {
        const response = await axios.post(
          `https://www.itexmo.com/php_api/api.php`,
          {
            to: "09517359838",
            text: "Hi, i like you!",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: `application/json`,
              // Accept: "application/json",
              Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMGIzYWUzZGJkZWQ3NGNjNDRlZmE5OTM2YTMxNGMwNjUzY2YwMGFiMmUxZGEzMjA3Njk4NjFhYTgxOGYyODQ0YTRmYzI4NWIzMzgxNDJmM2EiLCJpYXQiOjE2MTg2Njk4ODgsIm5iZiI6MTYxODY2OTg4OCwiZXhwIjoxNjUwMjA1ODg4LCJzdWIiOiIxMzM0NyIsInNjb3BlcyI6W119.Crat1LuK-Y2ZUZ5x4tD2o_MNUByQv260TEihb3Uw2Hpi7GtD7RLhxgPsCUggIpu9BtKoxe69oyZaOCSmjPdT5l7d42p9bTbz-9QBCjwWJ5hzlv-47bZS1UTe9kmZOVhZWY0MJGDcrILaFJhliIRN4cocV4sonOhdgpSlqoHk27fOt0I1k5ElLkMomOGusatOEXBTKh04--Kc4f8ClX9-XW9yjlmxbrhx2Td9c4Uv-gvMiSyVEHF_jnPxtQTluXoervCfLRwhxLbPvOIGEp3Jm_M6lssgcMGzGJcex1IV0qWdF7XoUU5Qk7Hn1VrhACCDmK6vA14kvz8n1tbMKIJhhj5uiIvke_xrtYIlxUI_HQlC2pjHHnNsEcQ6OkHGD-v8Ik37Bcp4r6gYX4WUgta-zDx8Ycr8pwt04IYD7MslvOtRLlLwcWotDDQAiExqNuNIjHMScCWfhM8vn9KdwUsZx3HAJ0bRn__n8ecxOD-0OMxA929gtIXs_oNTqAfiC8w0huJ6O_73-qstoQKBL88gs8BbXPf4VAvDxdvXjsCbWXxVqARJb0gCTzdqqjive2CfDXov5_uBsYO9ctqXiHWRbnS_9ljQVao_vcUAhzheQSn0aDpb4okXMXUXr1gik_3DkOKTuhCKayTuXVzdWtcSLIR6lPjkYFvWFJN9D0W2e7w`,
            },
          }
        );
        res.json(response);
      } catch (error) {
        console.log(`error`, error);
        res.json(error);
      }
    }
  );

  app.use("/api/news/", router);
};

export default NewsController;
