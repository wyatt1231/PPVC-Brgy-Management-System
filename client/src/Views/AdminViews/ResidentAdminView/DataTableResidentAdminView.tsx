import {
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import FormikCheckbox from "../../../Component/Formik/FormikCheckbox";
import FormikDateField from "../../../Component/Formik/FormikDateField";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import LoadingButton from "../../../Component/LoadingButton";
import PreviewPDF from "../../../Component/PreviewPDF";
import { InvalidDateToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import UsePdf from "../../../Hooks/UsePdf";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { setResidentDataTableAction } from "../../../Services/Actions/ResidentActions";
import ResidentApi from "../../../Services/Api/ResidentApi";
import ITableColumns from "../../../Services/Interface/ITableColumns";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { ResidentModel } from "../../../Services/Models/ResidentModels";
import { RootStore } from "../../../Services/Store";

interface DataTableResidentAdminInterface {}

const initialSearch = {
  first_name: "",
  last_name: "",
  min_age: "",
  max_age: "",
  gender: ["m", "f"],
  purok: ["1", "2", "3", "4", "5", "6", "7", "8"],
  edad: "",
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
    label: "Profile",
    width: 200,
    align: "left",
  },
  {
    label: "Gender",
    width: 50,
    align: "left",
  },
  {
    label: "Edad",
    width: 40,
    align: "left",
  },
  {
    label: "Purok",
    width: 50,
    align: "left",
  },
  {
    label: "Ulo Sa Pamilya",
    width: 50,
    align: "left",
  },
  {
    label: "Email Address",
    width: 150,
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
  // {
  //   label: "Aksyon",
  //   width: 50,
  //   align: "center",
  // },
];

export const DataTableResidentAdminView: FC<DataTableResidentAdminInterface> =
  memo(() => {
    const dispatch = useDispatch();

    const table_loading = useSelector(
      (store: RootStore) => store.ResidentReducer.fetch_resident_data_table
    );
    const data_table: Array<ResidentModel> = useSelector(
      (store: RootStore) => store.ResidentReducer.resident_data_table?.table
    );

    const [soa, set_soa] = useState();
    const [loading_soa, set_loading_soa] = useState(false);

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

        dispatch(setResidentDataTableAction(filters));
      };

      mounted && activeSort && fetchTableData();

      return () => {
        mounted = false;
      };
    }, [activeSort, dispatch, tableLimit, tablePage, tableSearch]);

    const handlePrintPerTransacReport = useCallback(() => {
      if (soa) {
        UsePdf.printPdf(soa);
      }
    }, [soa]);

    const handleDownloadPerTransacReport = useCallback(() => {
      if (soa) {
        UsePdf.downloadPdf(soa, "Resident_Report.pdf");
      }
    }, [soa]);

    useEffect(() => {
      let mounted = true;

      const initializingState = () => {
        dispatch(
          setPageLinks([
            {
              link: "/admin/resident",
              title: "Residents",
            },
          ])
        );
      };

      mounted && initializingState();
      return () => (mounted = false);
    }, [dispatch]);

    const handleClickSOA = useCallback(async () => {
      set_loading_soa(true);
      const filters: PaginationModel = {
        page: {
          begin: tablePage,
          limit: tableLimit,
        },
        sort: activeSort,
        filters: tableSearch,
      };

      const response = await ResidentApi.getDataTableResidentPdf(filters);

      if (response.success) {
        set_soa(response.data);
      }
      set_loading_soa(false);
    }, [activeSort, tableLimit, tablePage, tableSearch]);

    return (
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
          style={{
            backgroundColor: `#fff`,
            padding: `1em`,
            borderRadius: 10,
          }}
        >
          <Grid item xs={12} container justify="flex-end" alignItems="center">
            <Grid item>
              <NavLink to="/admin/resident/add">
                <Button disableElevation color="primary" variant="contained">
                  Add Resident
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
                  handleChagenSelectedSortIndex={handleChagenSelectedSortIndex}
                  initialTableSort={initialTableSort}
                  selectedSortIndex={selectedSortIndex}
                />
              </Grid>

              <Grid item>
                {/* <DataTableSearch
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSetTableSearch({
                      ...tableSearch,
                      search: searchField,
                    });
                  }}
                  handleSetSearchField={handleSetSearchField}
                  searchField={searchField}
                /> */}
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
                            </Grid>
                            <Grid item xs={6}>
                              <Grid container spacing={3}>
                                <Grid item xs={6}>
                                  <FormikInputField
                                    name="min_age"
                                    label="Min Age"
                                    type="number"
                                    fullWidth={true}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <FormikInputField
                                    name="max_age"
                                    label="Max Age"
                                    type="number"
                                    fullWidth={true}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                  />
                                </Grid>
                              </Grid>
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
                                name="purok"
                                label="Purok"
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

              <Grid item>
                <Grid item>
                  <LoadingButton
                    handleClick={handleClickSOA}
                    color="primary"
                    variant="contained"
                    loading={loading_soa}
                    type="button"
                  >
                    View Pdf Report
                  </LoadingButton>
                </Grid>
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
                              errorMessage={`${row.first_name?.charAt(
                                0
                              )}${row.last_name?.charAt(0)}`}
                            />
                            <NavLink
                              className="title"
                              to={`/admin/resident/${row.resident_pk}`}
                            >
                              <span style={{ textTransform: "capitalize" }}>
                                {row.last_name}
                                {", "}
                                {row.first_name} {row.middle_name} {row.suffix}
                              </span>
                            </NavLink>
                          </div>
                        </TableCell>
                        <TableCell>
                          {row.gender === "m" ? "Lalaki" : "Babae"}
                        </TableCell>
                        <TableCell>{row.age}</TableCell>
                        <TableCell>Purok {row.purok}</TableCell>

                        <TableCell>
                          <Chip
                            label={row.ulo_pamilya}
                            style={{
                              // color: row.ulu_pamilya === "oo" ? "blue" :"red",
                              color: `#fff`,
                              backgroundColor:
                                row.ulo_pamilya === "oo" ? "blue" : "red",
                            }}
                          />
                        </TableCell>

                        <TableCell>{row.email}</TableCell>
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
                          <small className="datetime">
                            {InvalidDateToDefault(row.encoded_at, "-")}
                          </small>
                        </TableCell>
                        {/* <TableCell align="center">
                          <IconButtonPopper
                            buttons={[
                              {
                                text: "I-set na ulo sa pamilya",
                                handleClick: () =>
                                  dispatch(
                                    setSelectedHeadFam({
                                      open: true,
                                      resident_pk: row.resident_pk,
                                    })
                                  ),
                              },
                              // {
                              //   text: "I-butang na opisyal sa Brgy",
                              //   handleClick: () => console.log(`sad`),
                              // },
                            ]}
                          />
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>

        {soa && (
          <PreviewPDF
            file={soa}
            doc_title={`Resident_Reports.pdf`}
            type="pdf"
            handleClose={() => {
              set_soa(null);
            }}
            actions={
              <>
                <IconButton
                  onClick={() => {
                    handleDownloadPerTransacReport();
                  }}
                >
                  <GetAppRoundedIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handlePrintPerTransacReport();
                  }}
                >
                  <PrintRoundedIcon />
                </IconButton>
              </>
            }
          />
        )}
      </Container>
    );
  });

export default DataTableResidentAdminView;
