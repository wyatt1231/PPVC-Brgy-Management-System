import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PageLoader from "../Component/PageLoader";
import PagePrompt from "../Component/PagePrompt";
import PageSnackbar from "../Component/PageSnackbar";
import PageSuccessPrompt from "../Component/PageSuccessPrompt";
import { SetCurrentUserAction } from "../Services/Actions/UserActions";
import { RootStore } from "../Services/Store";
import LoginPortal from "../Views/LoginPortal/LoginPortal";
import SysAdminRoutes from "./AdminRoutes";
import Layout from "./Layout/Layout";

const Routes = memo(() => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.UserReducer.user);

  useEffect(() => {
    let mounted = true;
    const getUserInfo = async () => {
      dispatch(SetCurrentUserAction());
    };

    mounted && getUserInfo();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return (
    <div>
      <Router>
        <PageLoader />
        <PagePrompt />
        <PageSnackbar />
        <PageSuccessPrompt />
        <Switch>
          <Route path="/login" exact component={LoginPortal} />
          <Route path="/" exact component={LoginPortal} />
          <Layout>{user?.user_type === "admin" && <SysAdminRoutes />}</Layout>
        </Switch>
      </Router>
    </div>
  );
});
export default Routes;
