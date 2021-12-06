import {
  Button,
  Chip,
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
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import FormikCheckbox from "../../../Component/Formik/FormikCheckbox";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import {
  removeBarangayOfficialAction,
  setBrgyOfficialDataTableAction,
} from "../../../Services/Actions/BrgyOfficialActions";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import ITableColumns from "../../../Services/Interface/ITableColumns";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { BarangayOfficialModel } from "../../../Services/Models/BarangayOfficialModels";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { RootStore } from "../../../Services/Store";

interface DataTableBrgyOfficialAdminInterface {}

const initialSearch = {
  first_name: "",
  last_name: "",
  gender: ["m", "f"],
  sts_pk: ["A", "NA"],
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
    label: "Alphabetical Asc",
    value: {
      column: "fullname",
      direction: "asc",
    },
  },
  {
    label: "Alphabetical Desc",
    value: {
      column: "fullname",
      direction: "desc",
    },
  },
];

const tableColumns: Array<ITableColumns> = [
  {
    label: "Brgy. Official",
    width: 250,
    align: "left",
  },
  {
    label: "Gender",
    width: 50,
    align: "left",
  },
  {
    label: "Position",
    width: 50,
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
  {
    label: "Actions",
    width: 50,
    align: "center",
  },
];

const DataTableBrgyOfficialAdminView: FC<DataTableBrgyOfficialAdminInterface> =
  memo(() => {
    const dispatch = useDispatch();

    const table_loading = useSelector(
      (store: RootStore) =>
        store.BrgyOfficialReducer.fetching_brgy_official_data_table
    );
    const data_table: Array<BarangayOfficialModel> = useSelector(
      (store: RootStore) =>
        store.BrgyOfficialReducer?.brgy_official_data_table?.table
    );

    const [reset_table, set_reset_table] = useState(0);

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

    const handleRemoveBrgyOfficial = useCallback(
      async (official_pk: string) => {
        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                removeBarangayOfficialAction(official_pk, (msg: string) => {
                  // helpers.resetForm();
                  set_reset_table((r) => r + 1);
                })
              ),
          })
        );
      },
      [dispatch]
    );

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

        dispatch(setBrgyOfficialDataTableAction(filters));
      };

      mounted && activeSort && fetchTableData();

      return () => {
        mounted = false;
      };
    }, [activeSort, dispatch, tableLimit, tablePage, tableSearch, reset_table]);

    useEffect(() => {
      let mounted = true;

      const initializingState = () => {
        dispatch(
          setPageLinks([
            {
              link: window.location.pathname,
              title: "Brgy. Officials",
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
                <NavLink to="/admin/brgy-official/add">
                  <Button disableElevation color="primary" variant="contained">
                    Set Brgy. Official
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
                                  name="first_name"
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
                                  name="last_name"
                                  label="Last Name"
                                  type="text"
                                  fullWidth={true}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>{" "}
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
                <TableContainer>
                  <LinearLoadingProgress show={table_loading} />
                  <Table stickyHeader size="small">
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
                                errorMessage={`${row.first_name?.charAt(
                                  0
                                )}${row.last_name?.charAt(0)}`}
                              />
                              <NavLink
                                className="title"
                                to={`/admin/resident/${row.resident_pk}`}
                              >
                                <span style={{ textTransform: "capitalize" }}>
                                  {row.first_name} {row.middle_name}{" "}
                                  {row.last_name} {row.suffix}
                                </span>
                              </NavLink>
                              {/* <div className="sub-title">
                              {row.gender === "m" ? "Male" : "Female"}
                            </div> */}
                            </div>
                          </TableCell>
                          <TableCell>
                            {row.gender === "m" ? "Male" : "Female"}
                          </TableCell>
                          <TableCell>{row.position}</TableCell>

                          <TableCell>
                            <Chip
                              style={{
                                backgroundColor: row.sts_backgroundColor,
                                color: row.sts_color,
                              }}
                              label={row.sts_desc}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="datetime">
                              {InvalidDateTimeToDefault(row.encoded_at, "-")}
                            </div>
                          </TableCell>

                          <TableCell align="center">
                            <IconButtonPopper
                              buttons={[
                                {
                                  text: "Unset/Remove Brgy. Official",
                                  color: "primary",
                                  handleClick: () =>
                                    handleRemoveBrgyOfficial(
                                      row.official_pk?.toString()
                                    ),
                                },
                              ]}
                            />
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
  });

export default DataTableBrgyOfficialAdminView;
