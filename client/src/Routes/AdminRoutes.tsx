import React from "react";
import { Route, Switch } from "react-router-dom";
import AddBrgyOfficialAdminView from "../Views/AdminViews/BrgyOfficialAdminView/AddBrgyOfficialAdminView";
import DataTableBrgyOfficialAdminView from "../Views/AdminViews/BrgyOfficialAdminView/DataTableBrgyOfficialAdminView";
import AddCoAdminView from "../Views/AdminViews/CoAdminView/AddCoAdminView";
import DataTableCoAdminView from "../Views/AdminViews/CoAdminView/DataTableCoAdminView";
import AddResidentAdminView from "../Views/AdminViews/ResidentAdminView/AddResidentAdminView";
import DataTableResidentAdminView from "../Views/AdminViews/ResidentAdminView/DataTableResidentAdminView";

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
    </Switch>
  );
};

export default SysAdminRoutes;
