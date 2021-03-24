import React from "react";
import { Route, Switch } from "react-router-dom";
import AddBrgyOfficialAdminView from "../Views/AdminViews/BrgyOfficialAdminView/AddBrgyOfficialAdminView";
import DataTableBrgyOfficialAdminView from "../Views/AdminViews/BrgyOfficialAdminView/DataTableBrgyOfficialAdminView";
import AddCoAdminView from "../Views/AdminViews/CoAdminView/AddCoAdminView";
import DataTableCoAdminView from "../Views/AdminViews/CoAdminView/DataTableCoAdminView";
import DtComplaintAdminView from "../Views/AdminViews/ComplaintAdminView/DtComplaintAdminView";
import ManageComplaintAdminView from "../Views/AdminViews/ComplaintAdminView/ManageComplaintAdminView";
import DtNewsAdminView from "../Views/AdminViews/NewsAdminView/DtNewsAdminView";
import DtPostAdminView from "../Views/AdminViews/PostAdminViews/DtPostAdminView";
import AddResidentAdminView from "../Views/AdminViews/ResidentAdminView/AddResidentAdminView";
import DataTableResidentAdminView from "../Views/AdminViews/ResidentAdminView/DataTableResidentAdminView";
// import DataTableResidentAdminView from "../Views/AdminView";

const SysAdminRoutes = () => {
  return (
    <Switch>
      {/* <Route path="/admin/dashboard" exact>
        <DashboardAdminView />
      </Route> */}

      <Route path="/admin/administrator" exact>
        <DataTableCoAdminView />
      </Route>
      <Route path="/admin/administrator/add" exact>
        <AddCoAdminView />
      </Route>

      <Route path="/admin/resident" exact>
        <DataTableResidentAdminView />
      </Route>

      <Route path="/admin/resident/add" exact>
        <AddResidentAdminView />
      </Route>

      <Route path="/admin/brgy-official" exact>
        <DataTableBrgyOfficialAdminView />
      </Route>

      <Route path="/admin/brgy-official/add" exact>
        <AddBrgyOfficialAdminView />
      </Route>

      <Route path="/admin/news" exact>
        <DtNewsAdminView />
      </Route>

      <Route path="/admin/post" exact>
        <DtPostAdminView />
      </Route>

      <Route path="/admin/complaint" exact>
        <DtComplaintAdminView />
      </Route>

      <Route path="/admin/complaint/:complaint_pk" exact>
        <ManageComplaintAdminView />
      </Route>
    </Switch>
  );
};

export default SysAdminRoutes;
