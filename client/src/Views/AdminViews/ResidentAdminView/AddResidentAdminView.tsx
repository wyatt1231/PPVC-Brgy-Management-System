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
import { useHistory, useParams } from "react-router-dom";
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
  nationality: "Filipino",
  religion: "CATHOLIC",
  civil_status: "single",
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
  died_date: null,
  resident_date: null,
  kita: 0.0,
  educ: "",
};

const formSchema = yup.object({
  first_name: yup.string().required().max(150).label("First Name"),
  last_name: yup.string().required().max(150).label("Last Name"),
  gender: yup.string().required().max(150).label("Gender"),
  birth_date: yup.date().nullable().required().label("Birth Date"),
  nationality: yup.string().required().max(150).label("Nationality"),
  religion: yup.string().required().max(150).label("Religion"),
  civil_status: yup.string().required().max(150).label("Civil Status"),
  with_disability: yup.string().required().max(150).label("With Disability"),

  purok: yup.string().required().max(150).label("Purok"),
  phone: yup.string().max(150).label("Phone Number"),
  email: yup.string().email().max(150).label("Email Address"),
});

export const AddResidentAdminView: FC<AddResidentAdminInterface> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const params = useParams<any>();

  console.log(`params`, params);

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
          <Form
            className=""
            style={{
              backgroundColor: `#fff`,
              padding: `1em 4em`,
            }}
            noValidate
          >
            <div className="">
              <div className="box-header">
                <div className="form-title">
                  Pun-a ang mga kinahanglan nga impormasyon sa residente
                </div>
              </div>
              <div className="box-body">
                <Grid container spacing={2}>
                  <Grid xs={12} container justify="center" item>
                    <div style={{ padding: "1.5em 0" }}>
                      <PhotoField
                        label=""
                        height={180}
                        width={180}
                        selectedFile={pic}
                        name="pic"
                        variant="circle"
                        handleChange={handleSetPic}
                      />
                    </div>
                  </Grid>

                  <Grid xs={12}>
                    <div className="title">Personal Nga Impormasyon</div>
                  </Grid>

                  <Grid xs={12} item>
                    <FormikInputField
                      label="Unang Pangalan"
                      name="first_name"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} item>
                    <FormikInputField
                      label="Tungatunga nga ngalan"
                      name="middle_name"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} item>
                    <FormikInputField
                      label="Apelyido"
                      name="last_name"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid sm={3} item>
                    <FormikInputField
                      label="Sukwahi"
                      name="suffix"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} item>
                    <FormikRadio
                      name="gender"
                      label="Sekso"
                      variant="vertical"
                      data={[
                        {
                          id: "m",
                          label: "Lalaki",
                        },
                        {
                          id: "f",
                          label: "Babae",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid xs={12} item>
                    {(() => {
                      const label = "Adlawng Natawhan";
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

                  <Grid xs={12} item>
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
                          label="Nasyonalidad"
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

                  <Grid xs={12} item>
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
                          label="Relihiyon"
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

                  <Grid xs={12} item>
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
                          label="Hahimtang Sibil"
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

                  <Grid xs={12} item>
                    <FormikRadio
                      name="purok"
                      label="Asa na purok nag puyo ang residente?"
                      variant="horizontal"
                      data={[
                        {
                          id: "1",
                          label: "Purok 1",
                        },
                        {
                          id: "2",
                          label: "Purok 2",
                        },
                        {
                          id: "3",
                          label: "Purok 3",
                        },
                        {
                          id: "4",
                          label: "Purok 4",
                        },
                        {
                          id: "5",
                          label: "Purok 5",
                        },
                        {
                          id: "6",
                          label: "Purok 6",
                        },
                        {
                          id: "7",
                          label: "Purok 7",
                        },
                        {
                          id: "8",
                          label: "Purok 8",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid xs={12} item>
                    <FormikInputField
                      label="Tribo"
                      name="tribe"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      type="text"
                    />
                  </Grid>

                  <Grid xs={12} item>
                    <FormikInputField
                      label="Grado nakab-ot | Nag-eskwela / wala nag eskwela"
                      name="educ"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      type="text"
                    />
                  </Grid>

                  <Grid xs={12} item>
                    <FormikRadio
                      name="employment"
                      label="Matang sa trabaho, kanunay o panagsa?"
                      variant="horizontal"
                      data={[
                        {
                          id: "kanunay naay trabaho",
                          label: "kanunay naay trabaho",
                        },
                        {
                          id: "panagsa",
                          label: "panagsa ra ang trabaho",
                        },
                        {
                          id: "walay tranaho",
                          label: "walay trabaho",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid xs={12} item>
                    <FormikInputField
                      label="Binulan na kita"
                      name="kita"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      type="number"
                    />
                  </Grid>

                  <Grid xs={12} item>
                    <FormikRadio
                      name="with_disability"
                      label="Matang sa disability"
                      variant="vertical"
                      data={[
                        {
                          id: "y",
                          label: "Naa",
                        },
                        {
                          id: "n",
                          label: "Wala",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid xs={12}>
                    <div className="title">Status sa pagkabuhi</div>
                  </Grid>

                  <Grid xs={12} item>
                    {(() => {
                      const label = "Adlaw sugod pagpuyo sa barangay";
                      const name = "resident_date";
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

                  <Grid xs={12} item>
                    {(() => {
                      const label = "Adlaw pagkamatay (kung patay na)";
                      const name = "died_date";
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

                  <Grid xs={12}>
                    <div className="title">Account Nga Impormasyon</div>
                  </Grid>

                  <Grid xs={12} item>
                    <FormikInputField
                      label="Email Address (Used as username)"
                      name="email"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid xs={12} item>
                    <FormikInputField
                      label="Numero sa telepono"
                      name="phone"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      InputProps={{
                        inputComponent: MaskedPhoneNumber,
                      }}
                      required
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
