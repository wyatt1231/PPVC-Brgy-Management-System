import { Container, Grid } from "@material-ui/core";
import moment from "moment";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularLoadingProgress from "../../../Component/CircularLoadingProgress";
import CustomAvatar from "../../../Component/CustomAvatar";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import PostActions from "../../../Services/Actions/PostActions";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { RootStore } from "../../../Services/Store";
import FilterDtPostAdinView from "./FilterDtPostAdinView";
import PostReaction from "./PostReaction";
import { StyledPostItem } from "./styles";

interface DtPostAdminViewProps {}

export const DtPostAdminView: FC<DtPostAdminViewProps> = memo(() => {
  const dispatch = useDispatch();

  const posts = useSelector((store: RootStore) => store.PostReducer.posts);

  const fetch_posts = useSelector(
    (store: RootStore) => store.PostReducer.fetch_posts
  );

  const [table_filter, set_table_filter] = useState<PaginationModel>({
    filters: {
      search: "",
      date_from: null,
      date_to: null,
      sts_pk: ["UP", "PU"],
    },
    sort: {
      direction: "desc",
      column: "encoded_at",
    },
  });

  const handleSetTableFilter = useCallback((table_filter: PaginationModel) => {
    set_table_filter(table_filter);
  }, []);

  const [refetch_table, set_refetch_table] = useState(0);
  const handleRefetchTable = useCallback(() => {
    set_refetch_table((c) => c + 1);
  }, []);

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
    if (table_filter) {
      dispatch(PostActions.setPosts(table_filter));
    }
  }, [dispatch, refetch_table]);

  return (
    <Container maxWidth="lg">
      <LinearLoadingProgress show={fetch_posts} />

      {fetch_posts && !posts ? (
        <CircularLoadingProgress />
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FilterDtPostAdinView
              handleSetTableFilter={handleSetTableFilter}
              table_filter={table_filter}
              handleRefetchTable={handleRefetchTable}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <div
              style={{
                borderRadius: 7,
                backgroundColor: `#fff`,
                padding: `1em`,
              }}
            >
              <div className="title">Mga Posts</div>

              <div
                style={{
                  display: `grid`,
                  gridGap: `1em`,
                  padding: `1em`,
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
                      <div className="time">
                        {moment(p.encoded_at).fromNow()}
                      </div>
                    </div>
                    <div className="body">{p.body}</div>
                    <PostReaction posts_pk={p.posts_pk} />
                  </StyledPostItem>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      )}
    </Container>
  );
});

export default DtPostAdminView;
