import { Container, Grid } from "@material-ui/core";
import moment from "moment";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import CustomAvatar from "../../../Component/CustomAvatar";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import ComplaintActions from "../../../Services/Actions/ComplaintActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { RootStore } from "../../../Services/Store";
import { StyledComplaintItem } from "./styles";

interface DtComplaintAdminViewProps {}

export const DtComplaintAdminView: FC<DtComplaintAdminViewProps> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const complaint_table = useSelector(
    (store: RootStore) => store.ComplaintReducer.complaints_table
  );

  console.log(`news_table`, complaint_table);

  const fetch_complaint_table = useSelector(
    (store: RootStore) => store.ComplaintReducer.fetch_complaints_table
  );

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

  useEffect(() => {
    dispatch(ComplaintActions.setComplaintTable());
  }, [dispatch]);

  return (
    <Container maxWidth="lg">
      <LinearLoadingProgress show={fetch_complaint_table} />
      <Grid container spacing={3}>
        <Grid item xs={12} container justify="flex-end" alignItems="center">
          <Grid item>{/* <AddNewsAdminView /> */}</Grid>
        </Grid>

        <Grid item xs={12}>
          <Container
            maxWidth="sm"
            style={{
              minHeight: `100vh`,
              backgroundColor: `#fff`,
              borderRadius: `7px`,
              padding: `.5em `,
              display: `grid`,
              gridGap: `1em`,
              alignContent: `start`,
              alignItems: `start`,
            }}
          >
            {complaint_table?.map((comp, index) => (
              <StyledComplaintItem key={index}>
                <div className="header">
                  <CustomAvatar
                    className="img"
                    src={comp?.user?.pic}
                    height={3}
                    width={3}
                    errorMessage={comp?.user?.full_name?.charAt(0)}
                  />

                  <div className="name">{comp?.user?.full_name}</div>
                  <div className="time">
                    {moment(comp.reported_at).fromNow()}
                  </div>

                  <div className="act">
                    <IconButtonPopper
                      buttons={[
                        {
                          text: "Go to Complaint",
                          handleClick: () =>
                            history.push(
                              window.location.pathname + "/" + comp.complaint_pk
                            ),
                        },
                      ]}
                    />
                  </div>
                </div>

                <div className="title">{comp?.title}</div>

                <div className="body">{comp?.body}</div>
              </StyledComplaintItem>
            ))}
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
});

export default DtComplaintAdminView;
