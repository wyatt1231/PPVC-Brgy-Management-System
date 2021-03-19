import { Chip, Container, Grid } from "@material-ui/core";
import moment from "moment";
import React, { FC, memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAvatar from "../../../Component/CustomAvatar";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import NewsActions from "../../../Services/Actions/NewsActions";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import { NewsModel } from "../../../Services/Models/NewsModels";
import { RootStore } from "../../../Services/Store";
import AddNewsAdminView from "./AddNewsAdminView";
import { StyledNewsContainer } from "./styles";

interface DtNewsAdminViewProps {}

export const DtNewsAdminView: FC<DtNewsAdminViewProps> = memo(() => {
  const dispatch = useDispatch();

  const news_table = useSelector(
    (store: RootStore) => store.NewsReducer.news_table
  );

  const fetch_news_table = useSelector(
    (store: RootStore) => store.NewsReducer.fetch_news_table
  );

  const RenderNewsAction = useCallback(
    (news: NewsModel) => {
      const actions: Array<any> = [
        {
          text: "Edit News",
          handleClick: () => {},
        },
      ];

      if (news.sts_pk === "PU") {
        actions.push({
          text: "Unpublish News",
          handleClick: () => {
            dispatch(
              setGeneralPrompt({
                open: true,
                continue_callback: () =>
                  dispatch(
                    NewsActions.unpublishNews(news.news_pk, () => {
                      dispatch(NewsActions.setNewsDataTable());
                    })
                  ),
              })
            );
          },
        });
      } else if (news.sts_pk === "UP") {
        actions.push({
          text: "Publish News",
          handleClick: () => {
            dispatch(
              setGeneralPrompt({
                open: true,
                continue_callback: () =>
                  dispatch(
                    NewsActions.republishNews(news.news_pk, () => {
                      dispatch(NewsActions.setNewsDataTable());
                    })
                  ),
              })
            );
          },
        });
      }

      return actions;
    },
    [dispatch]
  );

  useEffect(() => {
    let mounted = true;

    const initializingState = () => {
      dispatch(
        setPageLinks([
          {
            link: "/admin/news",
            title: "News",
          },
        ])
      );
    };

    mounted && initializingState();
    return () => (mounted = false);
  }, [dispatch]);

  useEffect(() => {
    dispatch(NewsActions.setNewsDataTable());
  }, [dispatch]);

  return (
    <Container maxWidth="lg">
      <LinearLoadingProgress show={fetch_news_table} />
      <Grid container spacing={3}>
        <Grid item xs={12} container justify="flex-end" alignItems="center">
          <Grid item>
            <AddNewsAdminView />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {news_table?.map((news, index) => (
            <StyledNewsContainer key={index} maxWidth={"sm"}>
              <div className="news-item">
                <div className="profile">
                  <CustomAvatar
                    className="img"
                    src={news.user_pic}
                    errorMessage={news?.user_full_name.charAt(0)}
                  />
                  <div className="name">{news?.user_full_name}</div>
                  <div className="time">
                    {moment(news?.encoded_at).fromNow()}
                  </div>
                </div>

                <div className="actions">
                  <IconButtonPopper buttons={RenderNewsAction(news)} />
                </div>

                <div className="title">
                  {news?.title}{" "}
                  <Chip
                    label={news?.sts_desc}
                    style={{
                      color: news?.sts_color,
                      backgroundColor: news?.sts_backgroundColor,
                    }}
                  />{" "}
                </div>
                <div className="body">{news.body}</div>
              </div>
            </StyledNewsContainer>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
});

export default DtNewsAdminView;
