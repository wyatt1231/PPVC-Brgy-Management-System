import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import CircularLoadingProgress from "../../../Component/CircularLoadingProgress";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import MultiRadioFieldHookForm from "../../../Component/HookForm/MultiRadioFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import LoadingButton from "../../../Component/LoadingButton";
import NewsActions from "../../../Services/Actions/NewsActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { NewsModel } from "../../../Services/Models/NewsModels";
import { RootStore } from "../../../Services/Store";

interface EditNewsAdminProps {
  news_pk: number;
  open: boolean;
  handleSetOpen: (open: boolean) => void;
}
const validate_main_details: any = yup.object({
  audience: yup.string().required().label("Audience"),
  title: yup.string().required().label("Task Title"),
  body: yup.string().required().label("Task Description"),
});

export const EditNewsAdminView: FC<EditNewsAdminProps> = memo(
  ({ news_pk, open, handleSetOpen }) => {
    const dispatch = useDispatch();

    const single_news = useSelector(
      (store: RootStore) => store.NewsReducer.single_news
    );

    const fetch_single_news = useSelector(
      (store: RootStore) => store.NewsReducer.fetch_single_news
    );

    const form_edit_news = useForm<any>({
      resolver: yupResolver(validate_main_details),
      mode: "onBlur",
    });

    const handleSubmitForm = useCallback(
      (data) => {
        const payload: NewsModel = {
          ...data,
          news_pk: news_pk,
        };

        console.log(`payload`, payload);

        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                NewsActions.updateNews(payload, () => {
                  dispatch(NewsActions.setNewsDataTable());
                  form_edit_news.reset();
                  handleSetOpen(false);
                })
              ),
          })
        );
      },
      [dispatch, form_edit_news, handleSetOpen, news_pk]
    );

    useEffect(() => {
      if (single_news) {
        console.log(`single_news ->`, single_news);
        form_edit_news.reset({
          title: single_news.title,
          body: single_news.body,
          audience: single_news.audience,
        });
      }
    }, [single_news]);

    useEffect(() => {
      dispatch(NewsActions.setSingleNews(news_pk));
    }, [dispatch, news_pk]);

    return (
      <div>
        <FormDialog
          title="Edit News"
          handleClose={() => handleSetOpen(false)}
          open={open}
          minWidth={500}
          body={
            fetch_single_news ? (
              <CircularLoadingProgress />
            ) : (
              <div>
                <FormProvider {...form_edit_news}>
                  <form
                    onSubmit={form_edit_news.handleSubmit(handleSubmitForm)}
                    noValidate
                    id="form_edit_news"
                  >
                    <div>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <MultiRadioFieldHookForm
                            name="audience"
                            label="Audience"
                            radio_items={[
                              {
                                value: "r",
                                label: "Residents Only",
                              },
                              {
                                value: "b",
                                label: "Brgy. Officials Only",
                              },
                              {
                                value: "all",
                                label: "All",
                              },
                            ]}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextFieldHookForm
                            name="title"
                            fullWidth
                            label="News Title"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextFieldHookForm
                            name="body"
                            label="News Content/Body"
                            fullWidth
                            multiline={true}
                            rows={4}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </form>
                </FormProvider>
              </div>
            )
          }
          actions={
            <>
              <Button onClick={() => {}} variant="contained">
                Reset
              </Button>

              <Button type="submit" variant="contained" form="form_edit_news">
                Save Changes
              </Button>
            </>
          }
        />
      </div>
    );
  }
);

export default EditNewsAdminView;
