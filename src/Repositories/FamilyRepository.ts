import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { FamilyModel } from "../Models/FamilyModel";
import { ResponseModel } from "../Models/ResponseModels";

const addFamily = async (payload: FamilyModel): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    if (payload.fam_pk) {
      console.log(`fam  pk`);
    } else {
      console.log(` none fam pk`);
    }

    const found_ulo_pamilya = await con.QuerySingle(
      `SELECT fam_pk FROM family WHERE ulo_pamilya = @ulo_pamilya;`,
      {
        ulo_pamilya: payload.ulo_pamilya,
      }
    );

    if (found_ulo_pamilya?.fam_pk) {
      payload.fam_pk = found_ulo_pamilya.fam_pk;
      const sql_update_fam = await con.Insert(
        `UPDATE family SET
          okasyon_balay = @okasyon_balay,
          straktura = @straktura,
          kadugayon_pagpuyo = @kadugayon_pagpuyo,
          okasyon_yuta = @okasyon_yuta,
          kaligon_balay = @kaligon_balay
          WHERE fam_pk=@fam_pk;
          `,
        payload
      );

      const truncate_fam_members = await con.Modify(
        `Delete  from family_member where fam_pk=@fam_pk;`,
        {
          fam_pk: payload.fam_pk,
        }
      );
      for (const fam of payload.fam_members) {
        fam.encoded_by = payload.encoded_by;
        fam.fam_pk = payload.fam_pk;
        const sql_add_fam_member = await con.Insert(
          `INSERT INTO family_member SET
              fam_pk = @fam_pk,
              resident_pk = @resident_pk,
              rel = @rel,
              encoded_by = @encoded_by;
              `,
          fam
        );

        if (sql_add_fam_member.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      con.Commit();
      return {
        success: true,
        message: "The Family has been added successfully!",
      };
    } else {
      const sql_add_fam = await con.Insert(
        `INSERT INTO family SET
          ulo_pamilya = @ulo_pamilya,
          okasyon_balay = @okasyon_balay,
          straktura = @straktura,
          kadugayon_pagpuyo = @kadugayon_pagpuyo,
          okasyon_yuta = @okasyon_yuta,
          kaligon_balay = @kaligon_balay,
          encoded_by = @encoded_by;
          `,
        payload
      );

      if (sql_add_fam.insertedId > 0) {
        for (const fam of payload.fam_members) {
          fam.encoded_by = payload.encoded_by;
          fam.fam_pk = sql_add_fam.insertedId;
          const sql_add_fam_member = await con.Insert(
            `INSERT INTO family_member SET
                fam_pk = @fam_pk,
                resident_pk = @resident_pk,
                rel = @rel,
                encoded_by = @encoded_by;
                `,
            fam
          );

          if (sql_add_fam_member.insertedId <= 0) {
            con.Rollback();
            return {
              success: false,
              message: "No affected rows while adding the fam member.",
            };
          }
        }

        con.Commit();
        return {
          success: true,
          message: "The news has been published successfully!",
        };
      } else {
        con.Rollback();
        return {
          success: false,
          message: "No affected rows while creating the news",
        };
      }
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getSingleFamily = async (ulo_pamilya: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const all_family: FamilyModel = await con.QuerySingle(
      `
        SELECT * FROM family WHERE ulo_pamilya=@ulo_pamilya;
        `,
      {
        ulo_pamilya: ulo_pamilya,
      }
    );

    all_family.fam_members = await con.Query(
      `
            SELECT * FROM family_member WHERE fam_pk = @fam_pk
            `,
      {
        fam_pk: all_family.fam_pk,
      }
    );

    for (const fm of all_family.fam_members) {
      fm.resident_info = await con.QuerySingle(
        `select * from resident where resident_pk = @resident_pk`,
        {
          resident_pk: fm.resident_pk,
        }
      );

      fm.resident_info.pic = await GetUploadedImage(fm.resident_info.pic);
    }

    con.Commit();
    return {
      success: true,
      data: all_family,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getAllFamily = async (purok: Array<string>): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const all_family: Array<FamilyModel> = await con.Query(
      `
      SELECT f.* FROM family  f LEFT JOIN resident r ON r.resident_pk = f.ulo_pamilya where r.purok in @purok order by f.encoded_at desc;
        `,
      {
        purok: purok,
      }
    );

    for (const fam of all_family) {
      fam.ulo_pamilya_info = await con.QuerySingle(
        `select * from resident where resident_pk=@resident_pk `,
        {
          resident_pk: fam.ulo_pamilya,
        }
      );

      fam.ulo_pamilya_info.pic = await GetUploadedImage(
        fam.ulo_pamilya_info.pic
      );

      fam.fam_members = await con.Query(
        `
              SELECT * FROM family_member WHERE fam_pk = @fam_pk
              `,
        {
          fam_pk: fam.fam_pk,
        }
      );

      for (const fm of fam.fam_members) {
        fm.resident_info = await con.QuerySingle(
          `select * from resident where resident_pk = @resident_pk`,
          {
            resident_pk: fm.resident_pk,
          }
        );

        fm.resident_info.pic = await GetUploadedImage(fm.resident_info.pic);
      }
    }

    con.Commit();
    return {
      success: true,
      data: all_family,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getFamilyOfResident = async (
  resident_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const all_family: FamilyModel = await con.QuerySingle(
      `
      SELECT * FROM family WHERE ulo_pamilya = @resident_pk or fam_pk = (SELECT fam_pk FROM family_member WHERE resident_pk = @resident_pk LIMIT 1)
        `,
      {
        resident_pk: resident_pk,
      }
    );

    if (!all_family) {
      con.Rollback();
      return {
        success: true,
        data: null,
      };
    }

    all_family.ulo_pamilya_info = await con.QuerySingle(
      `select * from resident where resident_pk=@resident_pk;`,
      {
        resident_pk: all_family.ulo_pamilya,
      }
    );

    if (all_family?.ulo_pamilya_info?.pic) {
      all_family.ulo_pamilya_info.pic = await GetUploadedImage(
        all_family.ulo_pamilya_info.pic
      );
    }

    all_family.fam_members = await con.Query(
      `
            SELECT * FROM family_member WHERE fam_pk = @fam_pk
            `,
      {
        fam_pk: all_family.fam_pk,
      }
    );

    for (const fm of all_family.fam_members) {
      fm.resident_info = await con.QuerySingle(
        `select * from resident where resident_pk = @resident_pk`,
        {
          resident_pk: fm.resident_pk,
        }
      );

      fm.resident_info.pic = await GetUploadedImage(fm.resident_info.pic);
    }

    con.Commit();
    return {
      success: true,
      data: all_family,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

export default {
  addFamily,
  getSingleFamily,
  getAllFamily,
  getFamilyOfResident,
};
