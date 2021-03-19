import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  TextField,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import moment from "moment";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import FormikRadio from "../../../Component/Formik/FormikRadio";
import MaskedPhoneNumber from "../../../Component/Mask/MaskedPhoneNumber";
import PhotoField from "../../../Component/PhotoField/PhotoField";
import { validateEmail } from "../../../Helpers/helpGetRegexValidators";
import { fileToBase64 } from "../../../Hooks/UseFileConverter";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import { addResidentAction } from "../../../Services/Actions/ResidentActions";
import { ResidentModel } from "../../../Services/Models/ResidentModels";
import {
  DbCivilStatus,
  DbNationality,
  DbReligion,
} from "../../../Storage/LocalDatabase";

interface AddResidentAdminInterface {}

const initFormValues: ResidentModel = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  gender: null,
  birth_date: null,
  nationality: "",
  religion: "",
  civil_status: "",
  dialect: "",
  tribe: "",
  with_disability: "",
  phone: "",
  email: "",
  purok: "",
  is_employed: null,
  employment: "",
  house_income: 0.0,
  house_status: "",
  voting_precinct: "",
  house_ownership: "",
};

const formSchema = yup.object({
  first_name: yup.string().required().max(150).label("First Name"),
  last_name: yup.string().required().max(150).label("Last Name"),
  gender: yup.string().required().max(150).label("Gender"),
  birth_date: yup.date().nullable().required().label("Birth Date"),
  nationality: yup.string().required().max(150).label("Nationality"),
  religion: yup.string().required().max(150).label("Religion"),
  civil_status: yup.string().required().max(150).label("Civil Status"),
  dialect: yup.string().required().max(150).label("Dialect"),
  tribe: yup.string().required().max(150).label("Tribe"),
  with_disability: yup.string().required().max(150).label("With Disability"),
  phone: yup.string().required().max(150).label("Phone Number"),
  email: yup
    .string()
    .required()
    .max(150)
    .label("Gender")
    .matches(validateEmail),
  purok: yup.string().required().max(150).label("Purok"),
  is_employed: yup.string().required().max(150).label("Is Employed"),
  employment: yup.string().required().max(150).label("Employment"),
  house_income: yup.string().max(150).label("House Income"),
  house_status: yup.string().max(150).label("House Status"),
  voting_precinct: yup.string().max(150).label("Voting Precinct"),
  house_ownership: yup.string().max(150).label("House Ownership"),
});

export const AddResidentAdminView: FC<AddResidentAdminInterface> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const formRef = useRef<FormikProps<ResidentModel> | null>(null);

  const [pic, setPic] = useState<File | null>(null);
  const handleSetPic = useCallback((logo) => {
    setPic(logo);
  }, []);

  const handleFormSubmit = useCallback(
    async (
      formValues: ResidentModel,
      helpers: FormikHelpers<ResidentModel>
    ) => {
      formValues.pic = await fileToBase64(pic);

      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              addResidentAction(formValues, (msg: string) => {
                helpers.resetForm();
                setPic(null);
              })
            ),
        })
      );
    },
    [dispatch, pic]
  );

  useEffect(() => {
    let mounted = true;

    const settingPageLinks = () => {
      dispatch(
        setPageLinks([
          {
            link: "/admin/resident",
            title: "Resident",
          },
          {
            link: window.location.pathname,
            title: "Add Resident",
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
                  Fill-up the resident information
                </div>
              </div>
              <div className="box-body">
                <Grid container spacing={4}>
                  <Grid xs={12} container justify="center" item>
                    <div style={{ padding: "1.5em 0" }}>
                      <PhotoField
                        label=""
                        height={150}
                        width={150}
                        selectedFile={pic}
                        name="pic"
                        variant="rounded"
                        handleChange={handleSetPic}
                      />
                    </div>
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="First Name"
                      name="first_name"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="Middle Name"
                      name="middle_name"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="Last Name"
                      name="last_name"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={3} item>
                    <FormikInputField
                      label="Suffix"
                      name="suffix"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikRadio
                      name="gender"
                      label="Gender"
                      variant="vertical"
                      data={[
                        {
                          id: "m",
                          label: "Male",
                        },
                        {
                          id: "f",
                          label: "Female",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    {(() => {
                      const label = "Birth Date";
                      const name = "birth_date";
                      const errorText =
                        errors[name] && touched[name] ? errors[name] : "";
                      const handleChange = (date) => {
                        setFieldValue(name, moment(date).toDate());
                      };
                      return (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <Grid container justify="space-around">
                            <KeyboardDatePicker
                              value={values[name]}
                              onChange={handleChange}
                              label={label}
                              variant="inline"
                              animateYearScrolling={true}
                              disableFuture={true}
                              format="MM/dd/yyyy"
                              fullWidth={true}
                              inputVariant="outlined"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              autoOk={true}
                              error={!!errorText}
                              helperText={errorText}
                            />
                          </Grid>
                        </MuiPickersUtilsProvider>
                      );
                    })()}
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    {(() => {
                      const name = "nationality";
                      const errorText =
                        errors[name] && touched[name] ? errors[name] : "";
                      const handleChange = (e: any) => {
                        setFieldValue(name, e.target.value);
                      };
                      return (
                        <TextField
                          value={values[name] ? values[name] : ""}
                          label="Nationality"
                          select
                          onChange={handleChange}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          error={!!errorText}
                          helperText={errorText}
                          required
                        >
                          {DbNationality.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    })()}
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    {(() => {
                      const name = "religion";
                      const errorText =
                        errors[name] && touched[name] ? errors[name] : "";
                      const handleChange = (e: any) => {
                        setFieldValue(name, e.target.value);
                      };
                      return (
                        <TextField
                          value={values[name] ? values[name] : ""}
                          label="Religion"
                          select
                          onChange={handleChange}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          error={!!errorText}
                          helperText={errorText}
                          required
                        >
                          {DbReligion.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    })()}
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    {(() => {
                      const name = "civil_status";
                      const errorText =
                        errors[name] && touched[name] ? errors[name] : "";
                      const handleChange = (e: any) => {
                        setFieldValue(name, e.target.value);
                      };
                      return (
                        <TextField
                          value={values[name] ? values[name] : ""}
                          label="Civil Status"
                          select
                          onChange={handleChange}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          error={!!errorText}
                          helperText={errorText}
                          required
                        >
                          {DbCivilStatus.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    })()}
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="Dialect"
                      name="dialect"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="Tribe"
                      name="tribe"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      type="text"
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikRadio
                      name="with_disability"
                      label="With Disability?"
                      variant="vertical"
                      data={[
                        {
                          id: "y",
                          label: "Yes",
                        },
                        {
                          id: "n",
                          label: "No",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="Email Address"
                      name="email"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      type="email"
                    />
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="Phone Number"
                      name="phone"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      InputProps={{
                        inputComponent: MaskedPhoneNumber,
                      }}
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="Purok"
                      name="purok"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="Voting Precinct"
                      name="voting_precinct"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikRadio
                      name="is_employed"
                      label="Is he/she Employed?"
                      variant="vertical"
                      data={[
                        {
                          id: "y",
                          label: "Yes",
                        },
                        {
                          id: "n",
                          label: "No",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="Job Employment"
                      name="employment"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="House Income"
                      name="house_income"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      type="number"
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="House Status"
                      name="house_status"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="House Ownership"
                      name="house_ownership"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
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
                    Add Resident
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="button"
                    color="secondary"
                    disableElevation
                    onClick={() => {
                      history.push(`/admin/resident`);
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
});

export default AddResidentAdminView;
