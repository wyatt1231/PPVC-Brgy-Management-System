import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import CustomStepper from "../../../Component/CustomStepper/CustomStepper";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import DateFieldHookForm from "../../../Component/HookForm/DateFieldHookForm";
import DropzoneFieldHookForm from "../../../Component/HookForm/DropzoneFieldHookForm";
import MultiRadioFieldHookForm from "../../../Component/HookForm/MultiRadioFieldHookForm";
import SingleCheckboxHookForm from "../../../Component/HookForm/SingleCheckboxHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import ObjectToFormDataHelper from "../../../Helpers/ObjectToFormDataHelper";
import NewsActions from "../../../Services/Actions/NewsActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";

interface AddNewsAdminProps {
  handleRefetchTable: () => void;
}

export const AddNewsAdminView: FC<AddNewsAdminProps> = memo(
  ({ handleRefetchTable }) => {
    const dispatch = useDispatch();
    const [open_add_news_dialog, set_open_add_news_dialog] = useState(false);

    const [active_step, set_active_step] = useState(0);

    const [form_payload, set_form_payload] = useState<any>({
      title: "",
      audience: "",
      body: "",
      is_prio: false,
      pub_date: new Date(),
      uploaded_files: [],
    });

    const schema: any = yup.object({
      audience: yup.string().required().label("Audience"),
      title: yup.string().required().label("Task Title"),
      pub_date: yup.date().required().nullable().label("Publish Date"),
      body: yup.string().required().label("Task Description"),
    });

    const form_add_news = useForm({
      resolver: yupResolver(schema),
      defaultValues: form_payload,
      mode: "onChange",
    });

    const handleSetOpenNewsDialog = useCallback((open: boolean) => {
      set_active_step(0);
      set_open_add_news_dialog(open);
    }, []);

    const Steps = [
      {
        label: "Punuan sa Detalya",
        View: (
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MultiRadioFieldHookForm
                  name="audience"
                  label="Para kinsa ang balita?"
                  radio_items={[
                    {
                      value: "r",
                      label: "Residente lang",
                    },
                    {
                      value: "b",
                      label: "Mga Opisyal sa brgy lang",
                    },
                    {
                      value: "all",
                      label: "Tanan",
                    },
                  ]}
                />
              </Grid>

              <Grid item xs={12}>
                <DateFieldHookForm
                  type="date"
                  name="pub_date"
                  label="Unsang adlawa mahitabo?"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  clearable
                  disablePast={true}
                  fullWidth
                  // inputVariant="outlined"
                  autoOk
                  defaultValue={null}
                />
              </Grid>

              <Grid item xs={12}>
                <SingleCheckboxHookForm
                  label="Importante o prayoridad ni nga balita?"
                  name="is_prio"
                />
              </Grid>

              <Grid item xs={12}>
                <TextFieldHookForm
                  fullWidth
                  name="title"
                  label="Ulo sa Balita"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextFieldHookForm
                  name="body"
                  label="Sulod sa balita"
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
        label: "Mga File",
        View: (
          <Grid item container>
            <Grid item xs={12}>
              <DropzoneFieldHookForm name="uploaded_files" />
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
          if (data.is_prio === "true") {
            data.is_prio = true;
          }

          console.log(`data`, data);
          const payload = ObjectToFormDataHelper(data);

          data?.uploaded_files?.forEach((f) => {
            payload.append("uploaded_files", f);
          });

          dispatch(
            setGeneralPrompt({
              open: true,
              continue_callback: () =>
                dispatch(
                  NewsActions.addNews(payload, () => {
                    handleRefetchTable();
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

    // useEffect(() => {
    //   if (active_step > 0) {
    //     alert(`.`);
    //     set_form_payload((prev) => {
    //       return {
    //         ...prev,
    //         ...form_add_news.getValues(),
    //       };
    //     });
    //   }
    // }, [active_step]);

    // useEffect(() => {
    //   form_add_news.reset({
    //     form_payload,
    //     ...form_add_news.getValues(),
    //   });
    // }, [form_payload]);

    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleSetOpenNewsDialog(true);
          }}
        >
          Pagbuhat og Balita
        </Button>
        <FormDialog
          title="Porma sa pagbuhat og balita"
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
                Usabon
              </Button>
              <Button
                onClick={() => {
                  handleBack();
                }}
                disabled={active_step === 0}
                variant="contained"
                color="secondary"
              >
                Balik
              </Button>
              <Button
                variant="contained"
                form="form_add_news"
                color="primary"
                type="submit"
              >
                {active_step === Steps.length - 1 ? `Ipasa` : "Sunod"}
              </Button>
            </>
          }
        />
      </div>
    );
  }
);

export default AddNewsAdminView;
