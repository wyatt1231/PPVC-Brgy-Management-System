import React from "react";
import { Route, Switch } from "react-router-dom";
import AddBrgyOfficialAdminView from "../Views/AdminViews/BrgyOfficialAdminView/AddBrgyOfficialAdminView";
import DataTableBrgyOfficialAdminView from "../Views/AdminViews/BrgyOfficialAdminView/DataTableBrgyOfficialAdminView";
import AddCoAdminView from "../Views/AdminViews/CoAdminView/AddCoAdminView";
import DataTableCoAdminView from "../Views/AdminViews/CoAdminView/DataTableCoAdminView";
import ManageCoAdminView from "../Views/AdminViews/CoAdminView/ManageCoAdminView";
import DtComplaintAdminView from "../Views/AdminViews/ComplaintAdminView/DtComplaintAdminView";
import ManageComplaintAdminView from "../Views/AdminViews/ComplaintAdminView/ManageComplaintAdminView";
import DashbboardAdminView from "../Views/AdminViews/DashbboardAdminView";
import CreateFamilyAdmin from "../Views/AdminViews/FamilyAdminView/CreateFamilyAdminView/CreateFamilyAdmin";
import FamilyAdminView from "../Views/AdminViews/FamilyAdminView/FamilyAdminView";
import FamilyView from "../Views/AdminViews/FamilyAdminView/FamilyView";
import ManageFamilyAdminView from "../Views/AdminViews/FamilyAdminView/ManageFamilyAdminView/ManageFamilyAdminView";
import DtNewsAdminView from "../Views/AdminViews/NewsAdminView/DtNewsAdminView";
import DtPostAdminView from "../Views/AdminViews/PostAdminViews/DtPostAdminView";
import AddResidentAdminView from "../Views/AdminViews/ResidentAdminView/AddResidentAdminView";
import DataTableResidentAdminView from "../Views/AdminViews/ResidentAdminView/DataTableResidentAdminView";
import ManageResidentAdminView from "../Views/AdminViews/ResidentAdminView/ManageResidentAdminView";
import CreateFamily from "../Views/SharedViews/CreateFamily";
// import DataTableResidentAdminView from "../Views/AdminView";

const SysAdminRoutes = () => {
  return (
    <>
      <CreateFamily />
      <Switch>
        <Route path="/admin/dashboard" exact>
          <DashbboardAdminView />
        </Route>

        <Route path="/admin/administrator" exact>
          <DataTableCoAdminView />
        </Route>
        <Route path="/admin/administrator/add" exact>
          <AddCoAdminView />
        </Route>
        <Route path="/admin/administrator/:admin_pk" exact>
          <ManageCoAdminView />
        </Route>

        <Route path="/admin/resident" exact>
          <DataTableResidentAdminView />
        </Route>

        <Route path="/admin/resident/add" exact>
          <AddResidentAdminView />
        </Route>

        <Route path="/admin/resident/:resident_pk" exact strict>
          <ManageResidentAdminView />
        </Route>

        <Route path="/admin/family" exact>
          <FamilyAdminView />
        </Route>
        <Route path="/admin/family/add" exact>
          <CreateFamilyAdmin />
        </Route>

        <Route path="/admin/family/:fam_pk" exact>
          {/* <ManageFamilyAdminView /> */}
          <FamilyView />
        </Route>

        <Route path="/admin/family/update/:fam_pk" exact>
          <ManageFamilyAdminView />
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
    </>
  );
};

export default SysAdminRoutes;
