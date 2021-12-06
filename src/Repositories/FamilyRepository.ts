import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { GenerateSearch } from "../Hooks/useSearch";
import { FamilyModel } from "../Models/FamilyModel";
import { PaginationModel } from "../Models/PaginationModel";
import { ResponseModel } from "../Models/ResponseModels";
import FamilyReport from "../PdfTemplates/FamilyReport";
const puppeteer = require("puppeteer");
const addFamily = async (
  payload: FamilyModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.encoded_by = user_pk;
    const insert_fam = await con.Insert(
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

    if (insert_fam.affectedRows) {
      const fam_pk = insert_fam.insertedId;
      for (const fam_mem of payload.fam_members) {
        fam_mem.fam_pk = fam_pk;
        fam_mem.encoded_by = user_pk;

        const sql_add_fam_member = await con.Insert(
          `INSERT INTO family_member SET
              fam_pk = @fam_pk,
              resident_pk = @resident_pk,
              rel=@rel,
              encoded_by=@encoded_by;
              `,
          fam_mem
        );

        if (sql_add_fam_member.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      for (const mk of payload.matang_kasilyas) {
        const sql_pangabasu = await con.Insert(
          `
            INSERT INTO family_matang_kasilyas
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip;
          `,
          {
            descrip: mk,
          }
        );
        if (sql_pangabasu.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      for (const mk of payload.biktima_pangabuso) {
        const insert = await con.Insert(
          `
            INSERT INTO family_biktima_pangabuso
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: mk,
          }
        );
        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      for (const mb of payload.kahimtanang_komunidad) {
        const insert = await con.Insert(
          `
            INSERT INTO family_kahimtanang_komunidad
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: mb,
          }
        );

        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      for (const mk of payload.matang_kasilyas) {
        const insert = await con.Insert(
          `
            INSERT INTO family_matang_kasilyas
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: mk,
          }
        );

        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      for (const pk of payload.pasilidad_kuryente) {
        const insert = await con.Insert(
          `
            INSERT INTO family_pasilidad_kuryente
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: pk,
          }
        );

        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      for (const mb of payload.matang_basura) {
        const insert = await con.Insert(
          `
            INSERT INTO family_matang_basura
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: mb,
          }
        );

        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      for (const tt of payload.tinubdan_tubig) {
        const insert = await con.Insert(
          `
            INSERT INTO family_tinubdan_tubig
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: tt,
          }
        );

        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      for (const sn of payload.serbisyo_nadawat) {
        const insert = await con.Insert(
          `
            INSERT INTO family_serbisyo_nadawat
            SET
            fam_pk='${fam_pk}',
            programa=@programa,
            ahensya=@ahensya;
          `,
          sn
        );
        if (insert.insertedId <= 0) {
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
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while trying to insert the family!",
      };
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

const updateFamily = async (
  payload: FamilyModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();
    payload.encoded_by = user_pk;
    const update_fam = await con.Modify(
      `UPDATE family SET
        ulo_pamilya = @ulo_pamilya,
        okasyon_balay = @okasyon_balay,
        straktura = @straktura,
        kadugayon_pagpuyo = @kadugayon_pagpuyo,
        okasyon_yuta = @okasyon_yuta,
        kaligon_balay = @kaligon_balay,
        encoded_by = @encoded_by
        WHERE fam_pk = @fam_pk
        `,
      payload
    );

    if (update_fam > 0) {
      const fam_pk = payload.fam_pk;

      await con.Modify(`DELETE FROM family_member where fam_pk=@fam_pk;`, {
        fam_pk,
      });
      for (const fam_mem of payload.fam_members) {
        fam_mem.fam_pk = fam_pk;
        fam_mem.encoded_by = user_pk;

        const sql_add_fam_member = await con.Insert(
          `INSERT INTO family_member SET
              fam_pk = @fam_pk,
              resident_pk = @resident_pk,
              rel=@rel,
              encoded_by=@encoded_by;
              `,
          fam_mem
        );

        if (sql_add_fam_member.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      await con.Modify(
        `DELETE FROM family_matang_kasilyas where fam_pk=@fam_pk;`,
        { fam_pk }
      );

      for (const mk of payload.matang_kasilyas) {
        const sql_pangabasu = await con.Insert(
          `
            INSERT INTO family_matang_kasilyas
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip;
          `,
          {
            descrip: mk,
          }
        );
        if (sql_pangabasu.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      await con.Modify(
        `DELETE FROM family_biktima_pangabuso where fam_pk=@fam_pk;`,
        { fam_pk }
      );

      for (const mk of payload.biktima_pangabuso) {
        const insert = await con.Insert(
          `
            INSERT INTO family_biktima_pangabuso
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: mk,
          }
        );
        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      await con.Modify(
        `DELETE FROM family_kahimtanang_komunidad where fam_pk=@fam_pk;`,
        { fam_pk }
      );
      for (const mb of payload.kahimtanang_komunidad) {
        const insert = await con.Insert(
          `
            INSERT INTO family_kahimtanang_komunidad
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: mb,
          }
        );

        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      await con.Modify(
        `DELETE FROM family_matang_kasilyas where fam_pk=@fam_pk;`,
        { fam_pk }
      );
      for (const mk of payload.matang_kasilyas) {
        const insert = await con.Insert(
          `
            INSERT INTO family_matang_kasilyas
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: mk,
          }
        );

        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      await con.Modify(
        `DELETE FROM family_pasilidad_kuryente where fam_pk=@fam_pk;`,
        { fam_pk }
      );
      for (const pk of payload.pasilidad_kuryente) {
        const insert = await con.Insert(
          `
            INSERT INTO family_pasilidad_kuryente
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: pk,
          }
        );

        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      await con.Modify(
        `DELETE FROM family_matang_basura where fam_pk=@fam_pk;`,
        { fam_pk }
      );
      for (const mb of payload.matang_basura) {
        const insert = await con.Insert(
          `
            INSERT INTO family_matang_basura
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: mb,
          }
        );

        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      await con.Modify(
        `DELETE FROM family_tinubdan_tubig where fam_pk=@fam_pk;`,
        { fam_pk }
      );
      for (const tt of payload.tinubdan_tubig) {
        const insert = await con.Insert(
          `
            INSERT INTO family_tinubdan_tubig
            SET
            fam_pk='${fam_pk}',
            descrip=@descrip; 
          `,
          {
            descrip: tt,
          }
        );

        if (insert.insertedId <= 0) {
          con.Rollback();
          return {
            success: false,
            message: "No affected rows while adding the fam member.",
          };
        }
      }

      await con.Modify(
        `DELETE FROM family_serbisyo_nadawat where fam_pk=@fam_pk;`,
        { fam_pk }
      );
      for (const sn of payload.serbisyo_nadawat) {
        const insert = await con.Insert(
          `
            INSERT INTO family_serbisyo_nadawat
            SET
            fam_pk='${fam_pk}',
            programa=@programa,
            ahensya=@ahensya;
          `,
          sn
        );
        if (insert.insertedId <= 0) {
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
        message: "The Family has been updated successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while trying to insert the family!",
      };
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

const getSingleFamByFamPk = async (fam_pk: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const family: FamilyModel = await con.QuerySingle(
      `
      SELECT f.*,
      CONCAT(
                          first_name
                          ,IF(COALESCE(middle_name,'') <> '' ,CONCAT(' ',middle_name,' '),' ')
                          ,last_name
                          ,IF(COALESCE(suffix,'') <> '' ,CONCAT(' ',suffix,' '),' ')
       ) ulo_fam_name, r.purok ulo_fam_purok
        FROM family f
       JOIN resident  r ON f.ulo_pamilya = r.resident_pk
      WHERE
       f.fam_pk=@fam_pk;
        `,
      {
        fam_pk,
      }
    );

    family.fam_members = await con.Query(
      `
            SELECT * FROM family_member WHERE fam_pk = @fam_pk
            `,
      {
        fam_pk,
      }
    );

    for (const fm of family.fam_members) {
      fm.resident_info = await con.QuerySingle(
        `select * from resident where resident_pk = @resident_pk`,
        {
          resident_pk: fm.resident_pk,
        }
      );

      fm.resident_info.pic = await GetUploadedImage(fm.resident_info.pic);
    }

    const tinubdan_tubig = await con.Query(
      `SELECT descrip FROM family_tinubdan_tubig where fam_pk = @fam_pk;`,
      { fam_pk }
    );
    family.tinubdan_tubig = tinubdan_tubig.map((d) => d.descrip);

    const matang_kasilyas = await con.Query(
      `SELECT * FROM family_matang_kasilyas where fam_pk = @fam_pk;`,
      { fam_pk }
    );
    family.matang_kasilyas = matang_kasilyas.map((d) => d.descrip);

    const pasilidad_kuryente = await con.Query(
      `SELECT * FROM family_pasilidad_kuryente where fam_pk = @fam_pk;`,
      { fam_pk }
    );
    family.pasilidad_kuryente = pasilidad_kuryente.map((d) => d.descrip);

    const matang_basura = await con.Query(
      `SELECT * FROM family_matang_basura where fam_pk = @fam_pk;`,
      { fam_pk }
    );
    family.matang_basura = matang_basura.map((d) => d.descrip);

    const biktima_pangabuso = await con.Query(
      `SELECT * FROM family_biktima_pangabuso where fam_pk = @fam_pk;`,
      { fam_pk }
    );
    family.biktima_pangabuso = biktima_pangabuso.map((d) => d.descrip);

    const kahimtanang_komunidad = await con.Query(
      `SELECT * FROM family_kahimtanang_komunidad where fam_pk = @fam_pk;`,
      { fam_pk }
    );
    family.kahimtanang_komunidad = kahimtanang_komunidad.map((d) => d.descrip);

    family.serbisyo_nadawat = await con.Query(
      `  SELECT * FROM family_serbisyo_nadawat where fam_pk = @fam_pk;`,
      { fam_pk }
    );

    con.Commit();
    return {
      success: true,
      data: family,
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

const getFamilyDataTable = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const all_family: Array<FamilyModel> = await con.QueryPagination(
      `
      SELECT * FROM 
      ( SELECT * FROM 
        (
          SELECT f.*,fu.first_name,fu.last_name,CONCAT(fu.first_name,' ',fu.last_name) ulo_fam_member,fu.purok ulo_fam_purok,
          coalesce(fbp.descrip, 'blanko')  AS 'biktima_pangabuso', 
          coalesce(fmk.descrip, 'blanko')  AS 'matang_kasilyas', 
          coalesce(fpk.descrip, 'blanko')  AS 'pasilidad_kuryente', 
          coalesce(fmb.descrip, 'blanko')   AS 'matang_basura',
          coalesce(ftb.descrip, 'blanko')  AS 'tinubdan_tubig'
           FROM family f JOIN
          resident fu ON f.ulo_pamilya = fu.resident_pk
          LEFT JOIN family_tinubdan_tubig ftb ON ftb.fam_pk = f.fam_pk
          LEFT JOIN family_matang_kasilyas fmk ON fmk.fam_pk = f.fam_pk
          LEFT JOIN family_pasilidad_kuryente fpk ON fpk.fam_pk = f.fam_pk
          LEFT JOIN family_matang_basura fmb ON fmb.fam_pk = f.fam_pk
          LEFT JOIN family_biktima_pangabuso fbp ON fbp.fam_pk = f.fam_pk
        ) AS tmp
        WHERE
        concat(first_name,' ',last_name)  LIKE concat('%',@quick_search,'%')
        AND coalesce(first_name, '') like concat('%',@ulo_pamilya_first_name,'%') 
        AND coalesce(last_name, '')  like concat('%',@ulo_pamilya_last_name,'%') 
        AND matang_kasilyas IN @matang_kasilyas
        AND tinubdan_tubig IN @tinubdan_tubig 
        AND pasilidad_kuryente IN @pasilidad_kuryente
        AND matang_basura IN @matang_basura
        AND biktima_pangabuso IN @biktima_pangabuso
        AND ulo_fam_purok IN @ulo_fam_purok
        ) tmp2
        group by fam_pk

      `,
      payload
    );

    const hasMore: boolean = all_family.length > payload.page.limit;

    if (hasMore) {
      all_family.splice(all_family.length - 1, 1);
    }

    for (const fam of all_family) {
      fam.ulo_pamilya_info = await con.QuerySingle(
        `select * from resident where resident_pk=@resident_pk `,
        {
          resident_pk: fam.ulo_pamilya,
        }
      );

      if (!!fam?.ulo_pamilya_info?.pic) {
        fam.ulo_pamilya_info.pic = await GetUploadedImage(
          fam.ulo_pamilya_info.pic
        );
      }

      fam.fam_members = await con.Query(
        `select * from family_member where fam_pk=@fam_pk `,
        {
          fam_pk: fam.fam_pk,
        }
      );

      for (const fm of fam.fam_members) {
        fm.resident_info = await con.QuerySingle(
          `select * from resident where resident_pk=@resident_pk `,
          {
            resident_pk: fm.resident_pk,
          }
        );

        if (!!fm?.resident_info?.pic) {
          fm.resident_info.pic = await GetUploadedImage(fm.resident_info.pic);
        }
      }
    }

    const count: number = hasMore
      ? -1
      : payload.page.begin * payload.page.limit + all_family.length;

    con.Commit();
    return {
      success: true,
      data: {
        table: all_family,
        begin: payload.page.begin,
        count: count,
        limit: payload.page.limit,
      },
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

const getFamilyDataTablePdf = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const brand_info: any = await con.QuerySingle(
      `
        SELECT logo FROM brand_logo LIMIT 1
      `,
      {}
    );

    var base64data = brand_info?.logo.toString("base64");

    const all_family: Array<FamilyModel> = await con.Query(
      `
      SELECT * FROM 
      ( SELECT * FROM 
        (
          SELECT f.*,fu.first_name,fu.last_name,CONCAT(fu.first_name,' ',fu.last_name) ulo_fam_member,fu.purok ulo_fam_purok,
          coalesce(fbp.descrip, 'blanko')  AS 'biktima_pangabuso', 
          coalesce(fmk.descrip, 'blanko')  AS 'matang_kasilyas', 
          coalesce(fpk.descrip, 'blanko')  AS 'pasilidad_kuryente', 
          coalesce(fmb.descrip, 'blanko')   AS 'matang_basura',
          coalesce(ftb.descrip, 'blanko')  AS 'tinubdan_tubig'
           FROM family f JOIN
          resident fu ON f.ulo_pamilya = fu.resident_pk
          LEFT JOIN family_tinubdan_tubig ftb ON ftb.fam_pk = f.fam_pk
          LEFT JOIN family_matang_kasilyas fmk ON fmk.fam_pk = f.fam_pk
          LEFT JOIN family_pasilidad_kuryente fpk ON fpk.fam_pk = f.fam_pk
          LEFT JOIN family_matang_basura fmb ON fmb.fam_pk = f.fam_pk
          LEFT JOIN family_biktima_pangabuso fbp ON fbp.fam_pk = f.fam_pk
        ) AS tmp
        WHERE
        concat(first_name,' ',last_name)  LIKE concat('%',@quick_search,'%')
        AND coalesce(first_name, '') like concat('%',@ulo_pamilya_first_name,'%') 
        AND coalesce(last_name, '')  like concat('%',@ulo_pamilya_last_name,'%') 
        AND matang_kasilyas IN @matang_kasilyas
        AND tinubdan_tubig IN @tinubdan_tubig 
        AND pasilidad_kuryente IN @pasilidad_kuryente
        AND matang_basura IN @matang_basura
        AND biktima_pangabuso IN @biktima_pangabuso
        AND ulo_fam_purok IN @ulo_fam_purok
        ) tmp2
        group by fam_pk
        ORDER BY ${payload.sort.column} ${payload.sort.direction}
      `,
      payload.filters
    );

    for (const fam of all_family) {
      fam.ulo_pamilya_info = await con.QuerySingle(
        `select * from resident where resident_pk=@resident_pk `,
        {
          resident_pk: fam.ulo_pamilya,
        }
      );

      fam.fam_members = await con.Query(
        `select * from family_member where fam_pk=@fam_pk `,
        {
          fam_pk: fam.fam_pk,
        }
      );
    }

    const browser = await puppeteer.launch({
      args: [
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-sandbox",
      ],
      headless: true,
    });

    console.log(`browser`, browser);

    const page = await browser.newPage();
    await page.setContent(`${FamilyReport.Content(all_family, payload)}`);

    const pdfBuffer = await page.pdf({
      format: "A4",
      displayHeaderFooter: true,
      headerTemplate: FamilyReport.Header(base64data),
      footerTemplate: FamilyReport.Footer(),
      margin: {
        top: "160px",
        bottom: "40px",
      },
    });

    await browser.close();
    con.Commit();
    return {
      success: true,
      data: `data:image/png;base64, ` + pdfBuffer.toString("base64"),
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

const searchNoFamResident = async (search: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const search_data_set = await con.Query(
      `
      SELECT * FROM 
                (
                  SELECT 
                  *
                  ,resident_pk id
                  ,CONCAT(
                    first_name
                    ,IF(COALESCE(middle_name,'') <> '' ,CONCAT(' ',middle_name,' '),' ')
                    ,last_name
                    ,IF(COALESCE(suffix,'') <> '' ,CONCAT(' ',suffix,' '),' ')
                  ) label FROM resident WHERE resident_pk NOT IN 
                  (SELECT ulo_pamilya FROM family
                  UNION
                  SELECT resident_pk FROM family_member  )
                ) AS tmp
        ${GenerateSearch(search, "label")}
        `,
      null
    );

    con.Commit();
    return {
      success: true,
      data: search_data_set,
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
const searchFamMember = async (payload: any): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const search_data_set = await con.Query(
      `
      SELECT * FROM 
                (
                  SELECT 
                  *
                  ,resident_pk id
                  ,CONCAT(
                    first_name
                    ,IF(COALESCE(middle_name,'') <> '' ,CONCAT(' ',middle_name,' '),' ')
                    ,last_name
                    ,IF(COALESCE(suffix,'') <> '' ,CONCAT(' ',suffix,' '),' ')
                  ) label FROM resident WHERE resident_pk NOT IN 
                  (SELECT ulo_pamilya FROM family
                  UNION
                  SELECT resident_pk FROM family_member  )
                ) AS tmp
        ${GenerateSearch(payload.value, "label")}
        AND id not in @fam_members
        `,
      {
        fam_members: payload.fam_members,
      }
    );

    con.Commit();
    return {
      success: true,
      data: search_data_set,
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
  updateFamily,
  getSingleFamily,
  getFamilyDataTable,
  getFamilyOfResident,
  searchNoFamResident,
  searchFamMember,
  getSingleFamByFamPk,
  getFamilyDataTablePdf,
};
