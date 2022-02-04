import {
  Avatar,
  Button,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { Formik, Form } from "formik";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import FormikCheckbox from "../../../Component/Formik/FormikCheckbox";
import FormikDateField from "../../../Component/Formik/FormikDateField";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { InvalidDateToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import { setAdminDataTableAction } from "../../../Services/Actions/AdminActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import ITableColumns from "../../../Services/Interface/ITableColumns";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { AdministratorModel } from "../../../Services/Models/AdminModel";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { RootStore } from "../../../Services/Store";

interface DataTableCoAdminViewInterface {}

const initialSearch = {
  firstname: "",
  lastname: "",
  gender: ["m", "f"],
  sts_pk: ["A", "NA"],
  encoded_from: null,
  encoded_to: null,
};

const initialTableSort: Array<ITableInitialSort> = [
  {
    label: "Newest first",
    value: {
      column: "encoded_at",
      direction: "desc",
    },
  },
  {
    label: "Oldest first",
    value: {
      column: "encoded_at",
      direction: "asc",
    },
  },
  {
    label: "A-Z",
    value: {
      column: "fullname",
      direction: "asc",
    },
  },
  {
    label: "Z-A",
    value: {
      column: "fullname",
      direction: "desc",
    },
  },
];

const tableColumns: Array<ITableColumns> = [
  {
    label: "Profile",
    width: 250,
    align: "left",
  },
  {
    label: "Gender",
    width: 50,
    align: "left",
  },
  {
    label: "Email Address",
    width: 150,
    align: "left",
  },
  {
    label: "Mobile Number",
    width: 90,
    align: "left",
  },
  {
    label: "Status",
    width: 50,
    align: "left",
  },
  {
    label: "Encoded At",
    width: 150,
    align: "left",
  },
];

export const DataTableCoAdminView: FC<DataTableCoAdminViewInterface> = memo(
  () => {
    const dispatch = useDispatch();

    const table_loading = useSelector(
      (store: RootStore) => store.AdminReducer.fetching_admin_data_table
    );
    const data_table: Array<AdministratorModel> = useSelector(
      (store: RootStore) => store.AdminReducer.admin_data_table?.table
    );

    console.log(`data_table`, data_table);

    const [
      tableSearch,
      tableLimit,
      tablePage,
      tableCount,
      activeSort,
      searchField,
      selectedSortIndex,
      handleSetTableSearch,
      handleChangePage,
      handleChangeRowsPerPage,
      handleChagenSelectedSortIndex,
      handleSetSearchField,
    ] = useFilter(initialSearch, initialTableSort, 50);

    useEffect(() => {
      let mounted = true;
      const fetchTableData = () => {
        const filters: PaginationModel = {
          page: {
            begin: tablePage,
            limit: tableLimit,
          },
          sort: activeSort,
          filters: tableSearch,
        };

        dispatch(setAdminDataTableAction(filters));
      };

      mounted && activeSort && fetchTableData();

      return () => {
        mounted = false;
      };
    }, [activeSort, dispatch, tableLimit, tablePage, tableSearch]);

    useEffect(() => {
      let mounted = true;

      const initializingState = () => {
        dispatch(
          setPageLinks([
            {
              link: "/admin/administrator",
              title: "Administrators",
            },
          ])
        );
      };

      mounted && initializingState();
      return () => (mounted = false);
    }, [dispatch]);

    return (
      <Container maxWidth="lg">
        <div
          style={{
            height: "100%",
            minHeight: 500,
            backgroundColor: `#fff`,
            borderRadius: 10,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} container justify="flex-end" alignItems="center">
              <Grid item>
                <NavLink to="/admin/administrator/add">
                  <Button disableElevation color="primary" variant="contained">
                    Add Administrator
                  </Button>
                </NavLink>
              </Grid>
            </Grid>
            <Grid
              xs={12}
              item
              container
              spacing={1}
              alignItems="center"
              alignContent="center"
            >
              <Grid
                item
                xs={12}
                md={6}
                container
                spacing={2}
                justify="flex-start"
                alignContent="center"
                alignItems="center"
              >
                <Grid item>
                  <TablePagination
                    rowsPerPageOptions={[50, 100, 250]}
                    component="div"
                    count={tableCount}
                    rowsPerPage={tableLimit}
                    page={tablePage}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                container
                spacing={3}
                alignContent="center"
                alignItems="center"
                justify="flex-end"
              >
                <Grid item>
                  <DataTableSort
                    handleChagenSelectedSortIndex={
                      handleChagenSelectedSortIndex
                    }
                    initialTableSort={initialTableSort}
                    selectedSortIndex={selectedSortIndex}
                  />
                </Grid>

                <Grid item>
                  <DataTableSearch
                    width={450}
                    FilterComponent={
                      <Formik
                        initialValues={tableSearch}
                        enableReinitialize
                        onSubmit={(form_values) => {
                          const filter_payload = {
                            ...form_values,
                          };
                          handleSetTableSearch(filter_payload);
                        }}
                      >
                        {() => (
                          <Form className="form">
                            <Grid container spacing={3}>
                              <Grid item xs={6}>
                                <FormikInputField
                                  name="firstname"
                                  label="First Name"
                                  type="text"
                                  fullWidth={true}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <FormikInputField
                                  name="lastname"
                                  label="Last Name"
                                  type="text"
                                  fullWidth={true}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <FormikCheckbox
                                  row={true}
                                  color="primary"
                                  name="gender"
                                  label="Gender"
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

                              <Grid item xs={12}>
                                <FormikCheckbox
                                  row={true}
                                  color="primary"
                                  name="sts_pk"
                                  label="Status"
                                  data={[
                                    {
                                      id: "A",
                                      label: "Active",
                                    },
                                    {
                                      id: "NA",
                                      label: "Not Active",
                                    },
                                  ]}
                                />
                              </Grid>

                              <Grid item xs={6}>
                                <FormikDateField
                                  name="encoded_from"
                                  clearable={true}
                                  label="Encoded From"
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <FormikDateField
                                  name="encoded_to"
                                  clearable={true}
                                  label="Encoded To"
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <Grid container spacing={2} justify="flex-end">
                                  <Grid item>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      type="button"
                                      onClick={() => {
                                        const filter_payload = {
                                          ...initialSearch,
                                          search: tableSearch.search,
                                        };
                                        handleSetTableSearch(filter_payload);
                                      }}
                                    >
                                      Clear Filters
                                    </Button>
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      type="submit"
                                      variant="contained"
                                      color="primary"
                                    >
                                      Apply Filters
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Form>
                        )}
                      </Formik>
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid
              xs={12}
              container
              item
              spacing={1}
              style={{ height: `100%`, overflowX: "auto" }}
            >
              <Grid item xs={12}>
                <TableContainer
                  style={{ height: "100%", minHeight: 500, borderRadius: 10 }}
                >
                  <LinearLoadingProgress show={table_loading} />
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {tableColumns.map((col, index) => (
                          <TableCell
                            key={index}
                            align={col.align}
                            style={{ minWidth: col.width }}
                          >
                            {col.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data_table?.length < 1 && (
                        <TableRow>
                          <TableCell align="center" colSpan={5}>
                            <span className="empty-rows">
                              No records has been added yet
                            </span>
                          </TableCell>
                        </TableRow>
                      )}
                      {data_table?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="table-cell-profile">
                              <CustomAvatar
                                className="image"
                                variant="rounded"
                                src={`${row.pic}`}
                                errorMessage={`${row.firstname?.charAt(
                                  0
                                )}${row.lastname?.charAt(0)}`}
                              />
                              <NavLink
                                className="title"
                                to={`/admin/administrator/${row.admin_pk}`}
                              >
                                <span style={{ textTransform: "capitalize" }}>
                                  {row.firstname} {row.lastname}
                                </span>
                              </NavLink>
                              {/* <div className="title">
                                <span style={{ textTransform: "capitalize" }}>
                                  {row.firstname} {row.lastname}
                                </span>
                              </div> */}
                            </div>
                          </TableCell>
                          <TableCell>
                            {row?.gender === "m" ? "Male" : "Female"}
                          </TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.phone}</TableCell>
                          <TableCell>
                            <div className="grid-justify-start">
                              <span className="badge badge-blue">
                                {row.sts_desc}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="datetime">
                              {InvalidDateToDefault(row.encoded_at, "-")}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
);

export default DataTableCoAdminView;
