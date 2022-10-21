import { Avatar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTheme } from "@material-ui/styles";
import { Form, Formik, FormikHelpers } from "formik";
import React, { FC, memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import app_logo from "../../Assets/Images/Logo/logo.jpg";
import LoadingButton from "../../Component/LoadingButton";
import { APP_NAME } from "../../Helpers/AppConfig";
import { SetCurrentUserAction } from "../../Services/Actions/UserActions";
import { LoginApi } from "../../Services/Api/UserApi";
import { UserLogin } from "../../Services/Models/UserModels";
import FieldPassword from "./FieldPassword";
import FieldUsername from "./FieldUsername";
import { LoginStyles } from "./styles";

interface ILoginPortal {}

const authFormValues: UserLogin = {
  email: "",
  password: "",
};

export const LoginPortal: FC<ILoginPortal> = memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");
  const history = useHistory();

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  const handleSubmit = useCallback(
    async (values: UserLogin, formikHelpers: FormikHelpers<UserLogin>) => {
      setIsAuthenticating(true);
      const response = await LoginApi(values);
      setIsAuthenticating(false);
      if (response.success) {
        localStorage.setItem(
          APP_NAME,
          JSON.stringify({
            access_token: response.data.token,
          })
        );
        dispatch(SetCurrentUserAction());
      } else {
        if (typeof response.message === "string") {
          setAuthError(response.message);
        }
        formikHelpers.resetForm();
      }
    },
    [dispatch]
  );

  return (
    <LoginStyles theme={theme}>
      <div style={{ gridArea: "login" }} className="login-container">
        <div className="form-ctnr">
          <section className="header">
            <Avatar className="brand-logo" src={app_logo} alt="" />
            <div
              style={{
                fontSize: "1.4em",
                textAlign: "center",
                fontFamily: "Nunito",
                fontWeight: 900,
                padding: `.5em 0`,
              }}
            >
              {process.env.REACT_APP_CLIENT}
            </div>

            <div className="brand-name">{process.env.REACT_APP_NAME}</div>
            <div className="brand-caption">
              {process.env.REACT_APP_PROVIDER}
            </div>
          </section>

          <section className="body">
            <div className="body-title">
              You can sign into your account here
            </div>

            {!!authError && (
              <Alert variant="filled" className="error" severity="error">
                {authError}
              </Alert>
            )}

            <Formik initialValues={authFormValues} onSubmit={handleSubmit}>
              <Form className="form">
                <FieldUsername />
                <FieldPassword
                  showPassword={showPassword}
                  handleTogglePassword={handleTogglePassword}
                />

                {/* <NavLink to="/login" className="forgetpass">
                  <div className="forget-text">
                    Let us help you if you <span>forgot your password?</span>
                  </div>
                </NavLink> */}
                <div className="buttons">
                  <LoadingButton
                    type="submit"
                    className="submit-btn"
                    variant="contained"
                    // disableElevation
                    size="large"
                    color="primary"
                    loading={isAuthenticating}
                    fullWidth={true}
                    borderRadius={`50px`}
                  >
                    Log in
                  </LoadingButton>
                </div>
              </Form>
            </Formik>
          </section>
          {/* <section className="footer">
            <div className="title">Welcome back</div>
            <NavLink to="/login" className="forgetpass">
              <div className="forget-text">
                <span>Did you forgot your password?</span>
              </div>
            </NavLink>
          </section> */}
        </div>
      </div>
    </LoginStyles>
  );
});

export default LoginPortal;
