import { Container, Grid } from "@material-ui/core";
import moment from "moment";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularLoadingProgress from "../../../Component/CircularLoadingProgress";
import CustomAvatar from "../../../Component/CustomAvatar";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import PostActions from "../../../Services/Actions/PostActions";
import { RootStore } from "../../../Services/Store";
import PostReaction from "./PostReaction";
import { StyledPostItem } from "./styles";

interface DtPostAdminViewProps {}

export const DtPostAdminView: FC<DtPostAdminViewProps> = memo(() => {
  const dispatch = useDispatch();

  const posts = useSelector((store: RootStore) => store.PostReducer.posts);

  const fetch_posts = useSelector(
    (store: RootStore) => store.PostReducer.fetch_posts
  );

  useEffect(() => {
    dispatch(
      setPageLinks([
        {
          link: "/admin/post",
          title: "Posts",
        },
      ])
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(PostActions.setPosts());
  }, [dispatch]);

  return (
    <Container maxWidth="lg">
      <LinearLoadingProgress show={fetch_posts} />

      {fetch_posts && !posts ? (
        <CircularLoadingProgress />
      ) : (
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} container justify="flex-end" alignItems="center">
            <Grid item>{/* <AddNewsAdminView /> */}</Grid>
          </Grid>

          <Grid item xs={6}>
            <div
              style={{
                display: `grid`,
                gridGap: `1em`,
              }}
            >
              {posts?.map((p, i) => (
                <StyledPostItem key={i}>
                  <div className="header">
                    <CustomAvatar
                      src={p.user.pic}
                      className="img"
                      errorMessage={p.user.full_name.charAt(0)}
                    />
                    <div className="name">{p.user.full_name}</div>
                    <div className="time">{moment(p.encoded_at).fromNow()}</div>
                  </div>
                  <div className="body">{p.body}</div>
                  <PostReaction posts_pk={p.posts_pk} />
                </StyledPostItem>
              ))}
            </div>
          </Grid>
        </Grid>
      )}
    </Container>
  );
});

export default DtPostAdminView;
