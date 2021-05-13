import { Chip, Container, Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import moment from "moment";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useDispatch, useSelector } from "react-redux";
import CircularLoadingProgress from "../../../Component/CircularLoadingProgress";
import CustomAvatar from "../../../Component/CustomAvatar";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import PostActions from "../../../Services/Actions/PostActions";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { PostsModel } from "../../../Services/Models/PostModels";
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

  const has_more = useSelector(
    (store: RootStore) => store.PostReducer.posts_table_has_more
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
    page: {
      begin: 0,
      limit: 5,
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
                <InfiniteScroll
                  pageStart={5}
                  initialLoad={false}
                  loadMore={(p: number) => {
                    const filter: PaginationModel = {
                      ...table_filter,
                      page: {
                        ...table_filter.page,
                        limit: p,
                      },
                    };
                    handleSetTableFilter(filter);
                    handleRefetchTable();
                  }}
                  hasMore={has_more}
                  loader={
                    <div className="loader" key={0}>
                      <Skeleton
                        style={{
                          margin: `1em`,
                        }}
                        variant="rect"
                        width={`100%`}
                        height={200}
                      />
                    </div>
                  }
                >
                  {posts?.map((p, i) => (
                    <StyledPostItem key={i}>
                      <div className="header">
                        <div className="profile">
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

                        <div className="actions">
                          <IconButtonPopper
                            buttons={[
                              {
                                text:
                                  p.sts_pk === "PU"
                                    ? "Unpublish Post"
                                    : "Publish Post",
                                handleClick: () => {
                                  dispatch(
                                    setGeneralPrompt({
                                      open: true,
                                      continue_callback: () => {
                                        const payload: PostsModel = {
                                          posts_pk: p.posts_pk,
                                          sts_pk:
                                            p.sts_pk === "PU" ? "UP" : "PU",
                                        };
                                        dispatch(
                                          PostActions.updatePostStatus(
                                            payload,
                                            () => {
                                              const filter: PaginationModel = {
                                                ...table_filter,
                                                page: {
                                                  begin: 0,
                                                  limit: 5,
                                                },
                                              };
                                              dispatch(
                                                PostActions.setPosts(filter)
                                              );
                                            }
                                          )
                                        );
                                      },
                                    })
                                  );
                                },
                              },
                            ]}
                          />
                        </div>
                      </div>
                      <div className="body">
                        <Chip
                          label={p?.status?.sts_desc}
                          style={{
                            color: p?.status?.sts_color,
                            backgroundColor: p?.status?.sts_backgroundColor,
                          }}
                        />
                      </div>
                      <div className="body">{p.body}</div>
                      <PostReaction posts_pk={p.posts_pk} />
                    </StyledPostItem>
                  ))}
                </InfiniteScroll>
              </div>
            </div>
          </Grid>
        </Grid>
      )}
    </Container>
  );
});

export default DtPostAdminView;
