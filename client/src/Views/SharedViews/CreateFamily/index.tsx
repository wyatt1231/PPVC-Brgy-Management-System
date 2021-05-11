import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import CircularLoadingProgress from "../../../Component/CircularLoadingProgress";
import CustomAvatar from "../../../Component/CustomAvatar";
import CustomStepper from "../../../Component/CustomStepper/CustomStepper";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import MultiRadioFieldHookForm from "../../../Component/HookForm/MultiRadioFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import FamilyActions from "../../../Services/Actions/FamilyActions";
import {
  setGeneralPrompt,
  setSelectedHeadFam,
} from "../../../Services/Actions/PageActions";
import ResidentApi from "../../../Services/Api/ResidentApi";
import {
  FamilyModel,
  FamMemberModel,
} from "../../../Services/Models/FamilyModel";
import { ResidentModel } from "../../../Services/Models/ResidentModels";
import { RootStore } from "../../../Services/Store";

interface ICreateFamily {}

export const CreateFamily: FC<ICreateFamily> = memo(() => {
  const [ulo_pamilya, set_ulo_pamilya] = useState<ResidentModel>(null);
  const dispatch = useDispatch();

  const [open_add_dialog, set_open_add_dialog] = useState(false);
  const [reload_selected_head_fam, set_reload_selected_head_fam] = useState(0);

  const single_fam = useSelector(
    (store: RootStore) => store.FamilyReducer.single_fam
  );

  const selected_head_fam = useSelector(
    (store: RootStore) => store.PageReducer.selected_head_fam
  );

  const handleSetOpenDialog = useCallback((open: boolean) => {
    set_open_add_dialog(open);
  }, []);

  const [fam_members, set_fam_members] = useState<Array<FamMemberModel>>([]);
  const [selected_resident, set_selected_resident] = useState<ResidentModel>(
    null
  );

  const handleAddFamMember = useCallback((fam_member: FamMemberModel) => {
    set_fam_members((prev) => {
      return [...prev, fam_member];
    });
  }, []);
  const handleSetResident = useCallback((resident: ResidentModel | null) => {
    set_selected_resident(resident);
  }, []);

  const handleRemoveFamMember = useCallback((index) => {
    set_fam_members((prev) => {
      prev.splice(index, 1);

      return [...prev];
    });
  }, []);

  const form_create_fam = useForm({
    mode: "onBlur",
  });

  const submitForm = (formData) => {
    const payload: FamilyModel = {
      ...formData,
      ulo_pamilya: ulo_pamilya.resident_pk,
      fam_members: fam_members,
    };

    dispatch(
      setGeneralPrompt({
        open: true,
        continue_callback: () =>
          dispatch(
            FamilyActions.addFamily(payload, (msg: string) => {
              // dispatch(setSelectedHeadFam({ open: false, resident_pk: null }));
              set_reload_selected_head_fam((prev) => prev + 1);
            })
          ),
      })
    );
  };

  const [loading_resident, set_loading_resident] = useState(false);

  useEffect(() => {
    let mounted = true;

    const getResdentInfo = async () => {
      set_loading_resident(true);
      const response = await ResidentApi.getSingleResident(
        selected_head_fam.resident_pk
      );

      set_loading_resident(false);

      if (response.success) {
        set_ulo_pamilya(response.data);

        if (response.data.ulo_pamilya === "oo") {
          dispatch(
            FamilyActions.getSingleFamily(selected_head_fam.resident_pk)
          );
        } else {
          dispatch(FamilyActions.getSingleFamily(null));
        }
      }
    };

    selected_head_fam && mounted && getResdentInfo();

    return () => {
      mounted = false;
    };
  }, [selected_head_fam, reload_selected_head_fam]);

  useEffect(() => {
    console.log(`single_fam`, single_fam);

    if (single_fam) {
      form_create_fam.reset(single_fam);
      set_fam_members([...single_fam.fam_members]);
    } else {
      form_create_fam.reset({});
      set_fam_members([]);
    }
  }, [single_fam]);

  const Steps = [
    {
      label: "Unang Bahin",
      View: <div>Unang Bahin</div>,
      subtitle: "Miyembro sa pamilya",
    },
    {
      label: "Ikaduhang Bahin",
      subtitle: "Mga unang  problema  sa panimalay",
      View: <div>Mga unang problema sa panimalay</div>,
    },
    {
      label: "Ikatulong Bahin",
      subtitle: "Kahimtang sa komunidad",
      View: <div>Kahimtang sa komunidad</div>,
    },
    {
      label: "Ika-upat Nga Bahin",
      subtitle: "Programa o serbisyo nga nadawat sa mga ahensya",
      View: <div>Programa o serbisyo nga nadawat sa mga ahensya</div>,
    },
  ];

  return (
    <>
      <FormDialog
        title="FAMILY ASSESSMENT DATA"
        open={selected_head_fam?.open !== false}
        // minWidth={900}
        maxWidth={"lg"}
        handleClose={() => {
          dispatch(
            setSelectedHeadFam({
              open: false,
              resident_pk: null,
            })
          );
        }}
        body={
          loading_resident || !ulo_pamilya ? (
            <CircularLoadingProgress />
          ) : (
            <>
              <FormProvider {...form_create_fam}>
                <form
                  id="form-add-fam"
                  noValidate
                  onSubmit={form_create_fam.handleSubmit(submitForm)}
                  style={{ padding: `0 2em` }}
                >
                  <CustomStepper steps={Steps} active_step={0} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} spacing={2} container>
                      <Grid item xs={12}>
                        <div className="title">Pangalan sa ulo sa pamilya</div>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          disabled
                          name="last_name"
                          label="Apelyido"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                          value={ulo_pamilya?.last_name}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          disabled
                          label="Pangalan"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                          value={ulo_pamilya?.first_name}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          disabled
                          value={ulo_pamilya?.first_name}
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
                        value={ulo_pamilya?.purok}
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
                            label: "tag-iya",
                          },
                          {
                            value: "renta",
                            label: "renta",
                          },
                          {
                            value: "boarder",
                            label: "boarder",
                          },
                          {
                            label: "nangipon ug puyo",
                            value: "nangipon ug puyo",
                          },
                          {
                            label: "balay ug balay",
                            value: "nisumpay ug balay",
                          },
                        ]}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <MultiRadioFieldHookForm
                        name="okasyon_yuta"
                        label="Okasyon sa Yuta"
                        radio_items={[
                          {
                            label: "nanag-iya sa yuta",
                            value: "nanag-iya sa yuta",
                          },
                          {
                            value: "nang arkila sa yuya",
                            label: "binuhat sa Semento",
                          },
                          {
                            value: "informal settler",
                            label: "informal settler",
                          },
                          {
                            value: "tig-bantay sa yuta",
                            label: "tig-bantay sa yuta",
                          },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <TextFieldHookForm
                        fullWidth
                        variant="outlined"
                        name="kadugayon_pagpuyo"
                        label="Kadugayon sa pagpuyo sa Barangay (tuig)"
                        type="number"
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <MultiRadioFieldHookForm
                        name="straktura"
                        label="Straktura sa Balay"
                        radio_items={[
                          {
                            label: "binuhat sa kahoy",
                            value: "binuhat sa kahoy",
                          },
                          {
                            value: "binuhat sa semento",
                            label: "binuhat sa semento",
                          },
                          {
                            value: "kombinasyon sa kahoy ug semento",
                            label: "kombinasyon sa kahoy ug semento",
                          },

                          {
                            value: "binuhat sa mga nilabay na materyales",
                            label:
                              "binuhat sa mga nilabay na materyales sama sa (karton, plastic, kahoy, kawayan ug uban pa)(Salvaged materials)",
                          },
                          // {
                          //   value: "uban matang",
                          //   label: "Uban matang",
                          // },
                        ]}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <MultiRadioFieldHookForm
                        name="kaligon_balay"
                        label="Kalig-on sa balay"
                        radio_items={[
                          {
                            label: "huyang",
                            value: "huyang",
                          },
                          {
                            label: "lig-on",
                            value: "lig-on",
                          },
                        ]}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <div className="title">SAKOP SA PIMIMALAY</div>
                    </Grid>
                    <Grid item xs={12} container justify="flex-end">
                      <Grid item>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => {
                            handleSetOpenDialog(true);
                          }}
                        >
                          Dungag og Sakop sa Pamilya
                        </Button>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Pangalan</TableCell>
                              <TableCell>Relasyon</TableCell>
                              <TableCell>Aksyon</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {fam_members.length <= 0 && (
                              <TableRow>
                                <TableCell colSpan={4} align="center">
                                  Walay sakop sa pamilya nga gi butang.
                                </TableCell>
                              </TableRow>
                            )}
                            {fam_members.map((f, i) => (
                              <TableRow key={i}>
                                <TableCell>
                                  <div
                                    style={{
                                      display: `grid`,
                                      gridGap: `.5em`,
                                      alignItems: `center`,
                                      alignContent: `center`,
                                      justifyContent: `start`,
                                      gridAutoFlow: `column`,
                                    }}
                                  >
                                    <CustomAvatar
                                      errorMessage={
                                        f?.resident_info?.first_name.charAt(0) +
                                        f?.resident_info?.last_name.charAt(0)
                                      }
                                      src={f?.resident_info?.pic}
                                    />
                                    <div>
                                      {f?.resident_info?.last_name}{" "}
                                      {f?.resident_info?.first_name}{" "}
                                      {f?.resident_info?.middle_name}{" "}
                                      {f?.resident_info?.suffix}
                                    </div>
                                  </div>
                                </TableCell>

                                <TableCell>{f.rel}</TableCell>
                                <TableCell>
                                  <IconButtonPopper
                                    buttons={[
                                      {
                                        text: "Ipakita ang tibuok impormasyon",
                                        handleClick: () =>
                                          handleSetResident(f.resident_info),
                                      },
                                      {
                                        text: "Tanggalon sa listahan",
                                        handleClick: () =>
                                          handleRemoveFamMember(i),
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
                </form>
              </FormProvider>

              {/* <ResidentInfo
                resident={selected_resident}
                handleSetResident={handleSetResident}
              /> */}
            </>
          )
        }
        actions={
          <Button
            form="form-add-fam"
            type="submit"
            color="primary"
            variant="contained"
          >
            E-Save
          </Button>
        }
      />
    </>
  );
});

export default CreateFamily;
