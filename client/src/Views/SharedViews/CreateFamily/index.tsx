import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React, { memo, FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CustomAvatar from "../../../Component/CustomAvatar";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import FormikRadio from "../../../Component/Formik/FormikRadio";
import MultiRadioFieldHookForm from "../../../Component/HookForm/MultiRadioFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";

interface ICreateFamily {}

export const CreateFamily: FC<ICreateFamily> = memo(() => {
  const form_create_fam = useForm({
    // resolver: yupResolver(validate_main_details),
    // defaultValues: ,
    mode: "onBlur",
  });
  return (
    <>
      <FormDialog
        title="FAMILY ASSESSMENT DATA"
        open={false}
        // minWidth={900}
        maxWidth={"lg"}
        handleClose={() => {
          console.log(`..`);
        }}
        body={
          <>
            <FormProvider {...form_create_fam}>
              <form style={{ padding: `0 5em` }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} spacing={2} container>
                    <Grid item xs={12}>
                      <div className="title">Pangalan sa ulo sa pamilya</div>
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldHookForm
                        fullWidth
                        variant="outlined"
                        disabled
                        name="last_name"
                        label="Apelyido"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldHookForm
                        fullWidth
                        variant="outlined"
                        disabled
                        name="first_name"
                        label="Pangalan"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldHookForm
                        fullWidth
                        variant="outlined"
                        disabled
                        name="middle_name"
                        label="Apelyido sa inahan/pagkadalaga"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldHookForm
                      fullWidth
                      variant="outlined"
                      disabled
                      name="middle_name"
                      label="Purok"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MultiRadioFieldHookForm
                      name="okasyon_balay"
                      label="Okasyon sa balay"
                      radio_items={[
                        {
                          value: "tag-iya",
                          label: "Tag-iya",
                        },
                        {
                          value: "renta",
                          label: "Renta",
                        },
                        {
                          value: "boarder",
                          label: "Boarder",
                        },
                        {
                          label: "Nangipon ug puyo",
                          value: "nangipon ug puyo",
                        },
                        {
                          label: "balay ug balay",
                          value: "Nisumpay ug Balay",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MultiRadioFieldHookForm
                      name="okasyon_balay"
                      label="Straktura sa Balay"
                      radio_items={[
                        {
                          label: "binuhat sa kahoy",
                          value: "binuhat sa kahoy",
                        },
                        {
                          value: "binuhat sa kahoy",
                          label: "nanag-iya sa yuta",
                        },
                        {
                          value: "Informal settler",
                          label: "informal settler",
                        },
                        {
                          value: "Tig-bantay sa yuta",
                          label: "tig-bantay sa yuta",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldHookForm
                      fullWidth
                      variant="outlined"
                      name="middle_name"
                      label="Kadugayon sa pagpuyo diha sa Barangay"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MultiRadioFieldHookForm
                      name="okasyon_balay"
                      label="Okasyon sa Yuta"
                      radio_items={[
                        {
                          label: "Nanag-iya sa yuta",
                          value: "Nanag-iya sa Yuta",
                        },
                        {
                          value: "binuhat sa kahoy",
                          label: "Binuhat sa Semento",
                        },
                        {
                          value: "kombinasyon sa kahoy ug semento",
                          label: "Kombinasyon sa kahoy ug semento",
                        },
                        {
                          value: "binuhat sa mga nilabay na materyales",
                          label:
                            "Binuhat sa mga nilabay na materyales sama sa (karton, plastic, kahoy, kawayan ug uban pa)(Salvaged materials)",
                        },
                        {
                          value: "uban matang",
                          label: "Uban matang",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MultiRadioFieldHookForm
                      name="kaligon_sa_balay"
                      label="Kalig-on sa balay"
                      radio_items={[
                        {
                          label: "Huyang",
                          value: "huyang",
                        },
                        {
                          label: "lig-on",
                          value: "Lig-on",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <div className="title">SAKOP SA PIMIMALAY</div>
                  </Grid>
                  <Grid item xs={12} container justify="flex-end">
                    <Grid item>
                      <Button color="primary" variant="contained">
                        Dungag og Sakop sa Pamilya
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Imahe</TableCell>
                            <TableCell>Tibuok Pangalan</TableCell>
                            <TableCell>Relasyon sa Ulo sa Panimalay</TableCell>
                            <TableCell>Aksyon</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <CustomAvatar errorMessage="S" src="" />
                            </TableCell>
                            <TableCell>Rodrigues, Marites</TableCell>
                            <TableCell>Asawa</TableCell>
                            <TableCell>
                              <IconButtonPopper
                                buttons={[
                                  {
                                    text: "Ipakita ang tibuok impormasyon",
                                    handleClick: () => console.log(`.`),
                                  },
                                  {
                                    text: "Tanggalon sa listahan",
                                    handleClick: () => console.log(`.`),
                                  },
                                ]}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </>
        }
      />
    </>
  );
});

export default CreateFamily;
