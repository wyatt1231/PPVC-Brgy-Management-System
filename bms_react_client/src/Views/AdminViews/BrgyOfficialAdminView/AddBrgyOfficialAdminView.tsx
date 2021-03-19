import {
  Button,
  Container,
  Grid,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import React, { FC, memo, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import FormikAutocomplete from "../../../Component/Formik/FormikAutocomplete";
import { addAdminAction } from "../../../Services/Actions/AdminActions";
import { addBarangayOfficialAction } from "../../../Services/Actions/BrgyOfficialActions";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import { BarangayOfficialModel } from "../../../Services/Models/BarangayOfficialModels";
import { DbBrgyOfficialPositions } from "../../../Storage/LocalDatabase";

interface AddBrgyOfficialAdminInterface {}

const initFormValues: BarangayOfficialModel = {
  resident_pk: null,
  resident_name: "",
  position: null,
};

const formSchema = yup.object({
  resident_pk: yup.string().required().max(150).label("Resident"),
  resident_name: yup.string().required().max(150).label("Resident"),
  position: yup.string().required().max(150).label("Position"),
});

export const AddBrgyOfficialAdminView: FC<AddBrgyOfficialAdminInterface> = memo(
  () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const formRef = useRef<FormikProps<BarangayOfficialModel> | null>(null);

    const handleFormSubmit = useCallback(
      async (
        formValues: BarangayOfficialModel,
        helpers: FormikHelpers<BarangayOfficialModel>
      ) => {
        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                addBarangayOfficialAction(formValues, (msg: string) => {
                  helpers.resetForm();
                })
              ),
          })
        );
      },
      [dispatch]
    );

    useEffect(() => {
      let mounted = true;

      const settingPageLinks = () => {
        dispatch(
          setPageLinks([
            {
              link: "/admin/brgy-official",
              title: "Brgy. Officials",
            },
            {
              link: window.location.pathname,
              title: "Add Brgy. Officials",
            },
          ])
        );
      };

      mounted && settingPageLinks();
      return () => (mounted = false);
    }, [dispatch]);

    return (
      <Container maxWidth="sm">
        <Formik
          initialValues={initFormValues}
          validationSchema={formSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleFormSubmit}
          innerRef={formRef}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="">
              <div className="">
                <div className="box-header">
                  <div className="form-title">
                    Fill-up the personal information
                  </div>
                </div>
                <div className="box-body" style={{ padding: `2em` }}>
                  <Grid container spacing={3}>
                    <Grid xs={12} item>
                      <FormikAutocomplete
                        label="Resident"
                        optKeyId="id"
                        optKeyLabel="label"
                        inputFieldName="resident_pk"
                        selectFieldName="resident_name"
                        endPoint="api/resident/searchResident"
                        variant="outlined"
                      />
                    </Grid>

                    <Grid xs={12} item>
                      {(() => {
                        const name = "position";
                        const errorText =
                          errors[name] && touched[name] ? errors[name] : "";
                        const handleChange = (e: any) => {
                          setFieldValue(name, e.target.value);
                        };
                        return (
                          <TextField
                            value={values[name] ? values[name] : ""}
                            label="Position"
                            select
                            onChange={handleChange}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            error={!!errorText}
                            helperText={errorText}
                            required
                          >
                            {DbBrgyOfficialPositions.map((value) => (
                              <MenuItem key={value} value={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </TextField>
                        );
                      })()}
                    </Grid>
                  </Grid>
                </div>
              </div>

              <div style={{ marginTop: "1em" }}>
                <Grid container justify={"flex-end"} spacing={3}>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disableElevation
                    >
                      Assign Brgy. Official
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      type="button"
                      color="secondary"
                      disableElevation
                      onClick={() => {
                        history.push(`/admin/brgy-official`);
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Form>
          )}
        </Formik>
      </Container>
    );
  }
);

export default AddBrgyOfficialAdminView;
