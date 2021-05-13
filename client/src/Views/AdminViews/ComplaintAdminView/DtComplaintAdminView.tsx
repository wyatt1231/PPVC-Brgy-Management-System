import { Button, Chip, Container, Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import moment from "moment";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import CustomAvatar from "../../../Component/CustomAvatar";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import ComplaintActions from "../../../Services/Actions/ComplaintActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { RootStore } from "../../../Services/Store";
import FilterDtComplaintAdminView from "./FilterDtComplaintAdminView";
import { StyledComplaintItem } from "./styles";

interface DtComplaintAdminViewProps {}

export const DtComplaintAdminView: FC<DtComplaintAdminViewProps> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const complaint_table = useSelector(
    (store: RootStore) => store.ComplaintReducer.complaints_table
  );

  const fetch_complaint_table = useSelector(
    (store: RootStore) => store.ComplaintReducer.fetch_complaints_table
  );

  const has_more = useSelector(
    (store: RootStore) => store.ComplaintReducer.has_more_complaints_table
  );

  console.log(`has_more`, has_more);

  const [refetch_table, set_refetch_table] = useState(0);
  const handleRefetchTable = useCallback(() => {
    set_refetch_table((c) => c + 1);
  }, []);

  const [table_filter, set_table_filter] = useState<PaginationModel>({
    filters: {
      search: "",
      date_from: null,
      date_to: null,
      sts_pk: ["P", "D", "AK", "OP", "C"],
    },
    sort: {
      direction: "desc",
      column: "reported_at",
    },
    page: {
      begin: 0,
      limit: 5,
    },
  });

  const handleSetTableFilter = useCallback((table_filter: PaginationModel) => {
    set_table_filter(table_filter);
  }, []);

  // const [open_filter_dialog, set_open_filter_dialog] = useState(false);
  // const handleOpenFilterDialog = useCallback((open: boolean) => {
  //   set_open_filter_dialog(open);
  // }, []);

  useEffect(() => {
    dispatch(ComplaintActions.setComplaintTable(table_filter));
  }, [dispatch, refetch_table]);

  useEffect(() => {
    let mounted = true;

    const initializingState = () => {
      dispatch(
        setPageLinks([
          {
            link: "/admin/complaint",
            title: "Complaints",
          },
        ])
      );
    };

    mounted && initializingState();
    return () => (mounted = false);
  }, [dispatch]);

  return (
    <Container maxWidth="lg">
      <LinearLoadingProgress show={fetch_complaint_table} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <FilterDtComplaintAdminView
            handleSetTableFilter={handleSetTableFilter}
            table_filter={table_filter}
            handleRefetchTable={handleRefetchTable}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          <div
            style={{
              minHeight: `100vh`,
              backgroundColor: `#fff`,
              borderRadius: `7px`,
              padding: `1em `,
              display: `grid`,
              gridGap: `1.5em`,
              alignContent: `start`,
              alignItems: `start`,
            }}
          >
            {complaint_table?.length <= 0 && (
              <div className="error">No complaints found!!!</div>
            )}

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
              {complaint_table?.map((comp, index) => (
                <StyledComplaintItem key={index}>
                  <div className="header">
                    <CustomAvatar
                      className="img"
                      src={comp?.user?.pic}
                      // height={4}
                      // width={4}
                      errorMessage={comp?.user?.full_name?.charAt(0)}
                    />

                    <div className="name">{comp?.user?.full_name}</div>
                    <div className="time">
                      {moment(comp?.reported_at).fromNow()}
                    </div>

                    <Chip
                      label={comp?.status?.sts_desc}
                      style={{
                        color: comp?.status?.sts_color,
                        backgroundColor: comp?.status?.sts_backgroundColor,
                        margin: `.3em 0`,
                      }}
                    />

                    <div className="act">
                      <IconButtonPopper
                        buttons={[
                          {
                            text: "Go to Complaint",
                            handleClick: () =>
                              history.push(
                                window.location.pathname +
                                  "/" +
                                  comp.complaint_pk
                              ),
                          },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="complaint-title">{comp?.title}</div>

                  <div className="body">{comp?.body}</div>
                </StyledComplaintItem>
              ))}
            </InfiniteScroll>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
});

export default DtComplaintAdminView;
