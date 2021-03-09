import { Button, Container, Grid } from "@material-ui/core";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
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
import { addAdminAction } from "../../../Services/Actions/AdminActions";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import { AdministratorModel } from "../../../Services/Models/AdminModel";

interface AddCoAdminViewInterface {}

const initFormValues: AdministratorModel = {
  pic: "",
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  gender: null,
};

const formSchema = yup.object({
  firstname: yup.string().required().max(150).label("First Name"),
  lastname: yup.string().required().max(150).label("Last Name"),
  email: yup.string().required().matches(validateEmail),
  phone: yup.string().required(),
  gender: yup.string().required().max(1).label("Gender"),
});

export const AddCoAdminView: FC<AddCoAdminViewInterface> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const formRef = useRef<FormikProps<AdministratorModel> | null>(null);

  const [pic, setPic] = useState<File | null>(null);
  const handleSetPic = useCallback((logo) => {
    setPic(logo);
  }, []);

  const handleFormSubmit = useCallback(
    async (
      formValues: AdministratorModel,
      helpers: FormikHelpers<AdministratorModel>
    ) => {
      formValues.pic = await fileToBase64(pic);

      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              addAdminAction(formValues, (msg: string) => {
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
            link: "/admin/administrator",
            title: "Administrators",
          },
          {
            link: window.location.pathname,
            title: "Add administrator",
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
              <div className="box-body">
                <Grid container spacing={3}>
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
                      name="firstname"
                      placeholder="Enter first name"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <FormikInputField
                      label="Last Name"
                      name="lastname"
                      placeholder="Enter last name"
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
                    <FormikInputField
                      label="Email Address"
                      name="email"
                      variant="outlined"
                      placeholder="Email Address"
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
                      placeholder="Phone Number"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      InputProps={{
                        inputComponent: MaskedPhoneNumber,
                      }}
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
                    Add Administrator
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="button"
                    color="secondary"
                    disableElevation
                    onClick={() => {
                      history.push(`/admin/administrator`);
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

export default AddCoAdminView;
