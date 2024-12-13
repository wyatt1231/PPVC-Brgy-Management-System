import {
  Button,
  Chip,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { io } from "socket.io-client";
import ComplaintActions from "../../../Services/Actions/ComplaintActions";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import { RootStore } from "../../../Services/Store";
import styled from "styled-components";
import CustomAvatar from "../../../Component/CustomAvatar";
import CircularLoadingProgress from "../../../Component/CircularLoadingProgress";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import { StyledManageComplaint } from "./styles";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import SelectFieldHookForm from "../../../Component/HookForm/SelectFieldHookForm";
import { ComplaintLogModel } from "../../../Services/Models/ComplaintLogModels";
import { ComplaintFilesModel } from "../../../Services/Models/ComplaintModels";
import { FTP_BASE_URL, SERVER_BASE_URL } from "../../../Helpers/Constants";
import { getAccessToken } from "../../../Helpers/AppConfig";
import moment from "moment";
import { ComplaintMessageModel } from "../../../Services/Models/ComplaintMessageModels";

interface ManageComplaintAdminViewProps {}

export const ManageComplaintAdminView: FC<ManageComplaintAdminViewProps> = memo(
  () => {
    const dispatch = useDispatch();
    const params = useParams<any>();

    const socketRef = useRef<any>();
    const messagesEndRef = useRef(null);
    const chatFormRef = useRef<HTMLFormElement>();
    const [chat_message, set_chat_message] = useState("");

    const [reload_messages, set_reload_messages] = useState(0);

    const single_complaint = useSelector(
      (store: RootStore) => store.ComplaintReducer.single_complaint
    );

    const fetch_single_complaint = useSelector(
      (store: RootStore) => store.ComplaintReducer.fetch_single_complaint
    );

    const selected_complaint_log = useSelector(
      (store: RootStore) => store.ComplaintReducer.selected_complaint_log
    );

    const fetch_selected_complaint_log = useSelector(
      (store: RootStore) => store.ComplaintReducer.fetch_selected_complaint_log
    );

    const complaint_messages = useSelector(
      (store: RootStore) => store.ComplaintReducer.complaint_messages
    );
    const fetch_complaint_messages = useSelector(
      (store: RootStore) => store.ComplaintReducer.fetch_complaint_messages
    );

    const [open_log_form, set_open_log_form] = useState(false);

    const handleSetOpenLogForm = useCallback((open: boolean) => {
      set_open_log_form(open);
    }, []);

    const [selected_file, set_selected_file] =
      useState<null | ComplaintFilesModel>(null);

    const handleSetSelectedFile = useCallback(
      (file: ComplaintFilesModel | null) => {
        set_selected_file(file);
      },
      []
    );

    const validate_log_form: any = yup.object({
      sts_pk: yup.string().required().label("Status"),
      notes: yup.string().required().label("Progress Remarks"),
    });

    const form_log = useForm({
      resolver: yupResolver(validate_log_form),
      defaultValues: {},
      mode: "onBlur",
    });

    const handleSubmitForm = useCallback(
      (data) => {
        const payload: ComplaintLogModel = {
          complaint_pk: single_complaint?.complaint_pk,
          notes: data.notes,
          sts_pk: data.sts_pk,
        };
        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                ComplaintActions.addComplaintLog(payload, () => {
                  dispatch(
                    ComplaintActions.setSingleComplaint(params?.complaint_pk)
                  );
                  dispatch(
                    ComplaintActions.setComplaintLogTable(params?.complaint_pk)
                  );
                  handleSetOpenLogForm(false);
                })
              ),
          })
        );
      },
      [dispatch, handleSetOpenLogForm, params, single_complaint]
    );

    const handleSubmitChat = useCallback(() => {
      if (chat_message.trim().length > 0) {
        const payload: ComplaintMessageModel = {
          body: chat_message,
          complaint_pk: params.complaint_pk,
        };

        console.log(`payload`, payload);

        dispatch(
          ComplaintActions.addComplaintMessage(payload, () => {
            socketRef.current.emit("sendMessage", params.complaint_pk);
            set_chat_message("");
          })
        );
      }
    }, [chat_message, dispatch, params]);

    useEffect(() => {
      let mounted = true;

      const initializingState = () => {
        dispatch(
          setPageLinks([
            {
              link: "/admin/complaint/manage",
              title: "Complaints",
            },
            {
              link: window.location.pathname,
              title: "Manage",
            },
          ])
        );
      };

      mounted && initializingState();
      return () => (mounted = false);
    }, [dispatch]);

    useEffect(() => {
      params?.complaint_pk &&
        dispatch(ComplaintActions.setSingleComplaint(params.complaint_pk));
    }, [dispatch, params]);

    useEffect(() => {
      single_complaint &&
        form_log.reset({
          sts_pk: single_complaint.sts_pk,
        });
    }, [open_log_form]);

    useEffect(() => {
      params?.complaint_pk &&
        dispatch(ComplaintActions.setComplaintLogTable(params.complaint_pk));
    }, [dispatch, params]);

    useEffect(() => {
      socketRef.current = io(`${SERVER_BASE_URL}socket/complaint/chat`, {
        query: {
          token: getAccessToken(),
        },
      });

      socketRef.current.on("connected", (data) => {});

      socketRef.current.emit("joinRoom", params.complaint_pk);

      socketRef.current.on("allMessage", () => {
        set_reload_messages((prev) => prev + 1);
      });

      socketRef.current.on("failedMessage", (error: string) => {
        // alert(error);
      });

      return () => {
        socketRef?.current?.disconnect();
      };
    }, [params]);

    useEffect(() => {
      dispatch(ComplaintActions.setComplaintMessage(params.complaint_pk));
    }, [dispatch, params, reload_messages]);

    // useEffect(() => {
    //   messagesEndRef.current?.scrollIntoView();
    // }, [message_table, active_tab]);

    return (
      <Container maxWidth="lg">
        {/* <LinearLoadingProgress show={fetch_single_complaint} /> */}
        {fetch_single_complaint ? (
          <CircularLoadingProgress />
        ) : (
          <>
            <StyledManageComplaint>
              <div className="profile">
                <div className="title">Complaint Details</div>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <div className="main-info">
                      <CustomAvatar
                        height={12}
                        width={12}
                        className="img"
                        src={single_complaint?.user?.pic}
                        errorMessage="U"
                      />
                      <div className="name">
                        {single_complaint?.user?.full_name}
                      </div>

                      <div className="sub-info">
                        <div>Status</div>
                        <div>
                          <Chip
                            label={single_complaint?.status?.sts_desc}
                            style={{
                              justifySelf: `start`,
                              color: single_complaint?.status?.sts_color,
                              backgroundColor:
                                single_complaint?.status?.sts_backgroundColor,
                            }}
                          />
                        </div>
                      </div>

                      <div className="sub-info">
                        <div>Reported At</div>
                        <div>
                          {InvalidDateTimeToDefault(
                            single_complaint?.reported_at,
                            "-"
                          )}
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={8}>
                    <div className="other-info">
                      <div className="body">{single_complaint?.body}</div>
                      <div className="title">Attached Files</div>
                      <div className="files">
                        {single_complaint?.complaint_file?.map((f, i) => (
                          <div
                            key={i}
                            className="file"
                            onClick={() => {
                              handleSetSelectedFile(f);
                            }}
                          >
                            {i + 1}. {f.file_name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>

              <div className="logs">
                <div className="title">Complaint Logs/Activities</div>
                <div className="actions">
                  <Button
                    variant="contained"
                    onClick={() => handleSetOpenLogForm(true)}
                    color="primary"
                    disabled={single_complaint?.sts_pk === "C"}
                  >
                    Update Status
                  </Button>
                </div>
                <TableContainer style={{ maxHeight: 250, height: 250 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width="20%">Audited At</TableCell>
                        <TableCell width="15%">Audited By</TableCell>
                        <TableCell width="15%">Status</TableCell>
                        <TableCell width="50%">Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fetch_selected_complaint_log && (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <CircularLoadingProgress />
                          </TableCell>
                        </TableRow>
                      )}

                      {selected_complaint_log?.map((l, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <small>
                              {" "}
                              {InvalidDateTimeToDefault(l.encoded_at, "-")}
                            </small>
                          </TableCell>
                          <TableCell>{l.user.full_name}</TableCell>
                          <TableCell>
                            <Chip
                              label={l.status.sts_desc}
                              style={{
                                color: l.status.sts_color,
                                backgroundColor: l.status.sts_backgroundColor,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <small>{l.notes}</small>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div className="chat">
                <div className="title">Conversations</div>
                <div className="chat-box">
                  <div className="messages">
                    {complaint_messages?.map((c, i) => (
                      <div key={i} className="message-dialog">
                        <div className="sender">
                          <CustomAvatar
                            className="img"
                            src={c?.user?.pic}
                            errorMessage={c?.user?.full_name.charAt(0)}
                          />
                          <div className="name">{c?.user?.full_name}</div>
                          <div className="datetime">
                            {moment(c.sent_at).fromNow()}
                          </div>
                        </div>
                        <div className="body">{c?.body}</div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="form"
                    ref={chatFormRef}
                    onSubmit={(e: any) => {
                      e.preventDefault();

                      handleSubmitChat();
                    }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Write a message here..."
                      multiline={true}
                      variant="outlined"
                      rows={3}
                      value={chat_message}
                      disabled={single_complaint?.status?.sts_pk === "C"}
                      onChange={(e) => set_chat_message(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13 && e.shiftKey === false) {
                          if (chatFormRef.current) {
                            e.preventDefault();
                            handleSubmitChat();
                          }
                        }
                      }}
                    />
                  </form>
                </div>
              </div>
            </StyledManageComplaint>
            <FormDialog
              open={open_log_form}
              handleClose={() => handleSetOpenLogForm(false)}
              title="Log Complaint Progress"
              body={
                <FormProvider {...form_log}>
                  <form
                    id="complaint-log-form"
                    onSubmit={form_log.handleSubmit(handleSubmitForm)}
                    noValidate
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <SelectFieldHookForm
                          name="sts_pk"
                          label="Status"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          options={[
                            {
                              title: "Disapproved",
                              value: "D",
                            },
                            {
                              title: "Pending",
                              value: "P",
                            },
                            {
                              title: "Acknowledged",
                              value: "AK",
                            },
                            {
                              value: "OP",
                              title: "On-progress",
                            },
                            {
                              value: "C",
                              title: "Closed",
                            },
                          ]}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextFieldHookForm
                          name="notes"
                          label="Progress Remarks"
                          fullWidth
                          multiline={true}
                          rows={8}
                          placeholder="Write the progress remarks here..."
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </form>
                </FormProvider>
              }
              actions={
                <>
                  <Button
                    form="complaint-log-form"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Save Progress
                  </Button>
                </>
              }
            />

            {selected_file && (
              <FormDialog
                open={selected_file !== null}
                handleClose={() => handleSetSelectedFile(null)}
                title={selected_file.file_name}
                body={
                  <div
                    style={{
                      display: `grid`,
                      justifyContent: `center`,
                      justifyItems: `center`,
                    }}
                  >
                    {(selected_file.mimetype.includes("image") ||
                      selected_file.file_name.match(
                        /.(jpg|jpeg|png|gif|jfif)$/i
                      )) && (
                      <img
                        src={FTP_BASE_URL + selected_file.file_path}
                        alt=""
                      />
                    )}
                  </div>
                }
              />
            )}
          </>
        )}
      </Container>
    );
  }
);

export default ManageComplaintAdminView;
