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
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { InvalidDateToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import {
  setPageLinks,
  setSelectedHeadFam,
} from "../../../Services/Actions/PageActions";
import { setResidentDataTableAction } from "../../../Services/Actions/ResidentActions";
import ITableColumns from "../../../Services/Interface/ITableColumns";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { ResidentModel } from "../../../Services/Models/ResidentModels";
import { RootStore } from "../../../Services/Store";

interface DataTableResidentAdminInterface {}

const initialSearch = {
  search: "",
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
  {
    label: "Aksyon",
    width: 50,
    align: "center",
  },
];

export const DataTableResidentAdminView: FC<DataTableResidentAdminInterface> = memo(
  () => {
    const dispatch = useDispatch();

    const table_loading = useSelector(
      (store: RootStore) => store.ResidentReducer.fetch_resident_data_table
    );
    const data_table: Array<ResidentModel> = useSelector(
      (store: RootStore) => store.ResidentReducer.resident_data_table?.table
    );

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
                <DataTableSearch
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSetTableSearch({
                      ...tableSearch,
                      search: searchField,
                    });
                  }}
                  handleSetSearchField={handleSetSearchField}
                  searchField={searchField}
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
                              variant="circle"
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
                        <TableCell>{row.purok}</TableCell>

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
                        <TableCell align="center">
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
                              {
                                text: "I-butang na opisyal sa Brgy",
                                handleClick: () => console.log(`sad`),
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
      </Container>
    );
  }
);

export default DataTableResidentAdminView;
