import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import CustomStepper from "../../../Component/CustomStepper/CustomStepper";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import DropzoneFieldHookForm from "../../../Component/HookForm/DropzoneFieldHookForm";
import MultiRadioFieldHookForm from "../../../Component/HookForm/MultiRadioFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import NewsActions from "../../../Services/Actions/NewsActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { NewsModel } from "../../../Services/Models/NewsModels";

interface AddNewsAdminProps {}

export const AddNewsAdminView: FC<AddNewsAdminProps> = memo(() => {
  const dispatch = useDispatch();
  const [open_add_news_dialog, set_open_add_news_dialog] = useState(false);

  const [active_step, set_active_step] = useState(0);

  const [form_payload, set_form_payload] = useState<any>({
    title: "",
    audience: "",
    body: "",
    upload_files: [],
  });

  const validate_main_details: any = yup.object({
    audience: yup.string().required().label("Audience"),
    title: yup.string().required().label("Task Title"),
    body: yup.string().required().label("Task Description"),
  });

  const form_add_news = useForm({
    resolver: yupResolver(validate_main_details),
    defaultValues: form_payload,
    mode: "onBlur",
  });

  const handleSetOpenNewsDialog = useCallback((open: boolean) => {
    set_open_add_news_dialog(open);
  }, []);

  const Steps = [
    {
      label: "Main Details",
      View: (
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
                fullWidth
                name="title"
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
      ),
    },
    {
      label: "Files",
      View: (
        <Grid item container>
          <Grid item xs={12}>
            <DropzoneFieldHookForm name="upload_files" />
          </Grid>
        </Grid>
      ),
    },
  ];

  const handleNext = () => {
    set_active_step((prev_active_step) => {
      if (prev_active_step === Steps.length - 1) {
        return prev_active_step;
      } else {
        return prev_active_step + 1;
      }
    });
  };

  const handleBack = () => {
    set_active_step((prevActiveStep) => {
      if (prevActiveStep === 0) {
        return prevActiveStep;
      } else {
        return prevActiveStep - 1;
      }
    });
  };

  const handleReset = () => {
    set_active_step(0);
  };

  const handleSubmitForm = useCallback(
    (data) => {
      if (active_step === Steps.length - 1) {
        const payload: NewsModel = data;

        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                NewsActions.addNews(payload, () => {
                  dispatch(NewsActions.setNewsDataTable());
                  form_add_news.reset();
                  handleSetOpenNewsDialog(false);
                })
              ),
          })
        );
      } else {
        handleNext();
      }
    },
    [active_step]
  );

  useEffect(() => {
    set_form_payload((prev) => {
      return {
        ...prev,
        ...form_add_news.getValues(),
      };
    });
  }, [active_step]);

  useEffect(() => {
    form_add_news.reset({
      form_payload,
      ...form_add_news.getValues(),
    });
  }, [form_payload]);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleSetOpenNewsDialog(true);
        }}
      >
        Create News
      </Button>
      <FormDialog
        title="News Publishing Form"
        handleClose={() => handleSetOpenNewsDialog(false)}
        open={open_add_news_dialog}
        minWidth={500}
        body={
          <div>
            <FormProvider {...form_add_news}>
              <form
                onSubmit={form_add_news.handleSubmit(handleSubmitForm)}
                noValidate
                id="form_add_news"
              >
                <CustomStepper steps={Steps} active_step={active_step} />
              </form>
            </FormProvider>
          </div>
        }
        actions={
          <>
            <Button
              onClick={() => {
                handleReset();
              }}
              variant="contained"
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                handleBack();
              }}
              disabled={active_step === 0}
              variant="contained"
              color="secondary"
            >
              Back
            </Button>
            <Button
              variant="contained"
              form="form_add_news"
              color="primary"
              type="submit"
            >
              {active_step === Steps.length - 1 ? `Submit` : "Next"}
            </Button>
          </>
        }
      />
    </div>
  );
});

export default AddNewsAdminView;
