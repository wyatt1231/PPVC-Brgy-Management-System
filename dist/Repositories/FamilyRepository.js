"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConfig_1 = require("../Configurations/DatabaseConfig");
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const useFileUploader_1 = require("../Hooks/useFileUploader");
const useSearch_1 = require("../Hooks/useSearch");
const addFamily = (payload, user_pk) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
      yield con.BeginTransaction();
      payload.encoded_by = user_pk;
      const insert_fam = yield con.Insert(
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
          const sql_add_fam_member = yield con.Insert(
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
          const sql_pangabasu = yield con.Insert(
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
          const insert = yield con.Insert(
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
          const insert = yield con.Insert(
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
          const insert = yield con.Insert(
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
          const insert = yield con.Insert(
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
          const insert = yield con.Insert(
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
          const insert = yield con.Insert(
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
          const insert = yield con.Insert(
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
      yield con.Rollback();
      console.error(`error`, error);
      return {
        success: false,
        message: useErrorMessage_1.ErrorMessage(error),
      };
    }
  });
const updateFamily = (payload, user_pk) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
      yield con.BeginTransaction();
      payload.encoded_by = user_pk;
      const update_fam = yield con.Modify(
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
        yield con.Modify(`DELETE FROM family_member where fam_pk=@fam_pk;`, {
          fam_pk,
        });
        for (const fam_mem of payload.fam_members) {
          fam_mem.fam_pk = fam_pk;
          fam_mem.encoded_by = user_pk;
          const sql_add_fam_member = yield con.Insert(
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
        yield con.Modify(
          `DELETE FROM family_matang_kasilyas where fam_pk=@fam_pk;`,
          { fam_pk }
        );
        for (const mk of payload.matang_kasilyas) {
          const sql_pangabasu = yield con.Insert(
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
        yield con.Modify(
          `DELETE FROM family_biktima_pangabuso where fam_pk=@fam_pk;`,
          { fam_pk }
        );
        for (const mk of payload.biktima_pangabuso) {
          const insert = yield con.Insert(
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
        yield con.Modify(
          `DELETE FROM family_kahimtanang_komunidad where fam_pk=@fam_pk;`,
          { fam_pk }
        );
        for (const mb of payload.kahimtanang_komunidad) {
          const insert = yield con.Insert(
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
        yield con.Modify(
          `DELETE FROM family_matang_kasilyas where fam_pk=@fam_pk;`,
          { fam_pk }
        );
        for (const mk of payload.matang_kasilyas) {
          const insert = yield con.Insert(
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
        yield con.Modify(
          `DELETE FROM family_pasilidad_kuryente where fam_pk=@fam_pk;`,
          { fam_pk }
        );
        for (const pk of payload.pasilidad_kuryente) {
          const insert = yield con.Insert(
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
        yield con.Modify(
          `DELETE FROM family_matang_basura where fam_pk=@fam_pk;`,
          { fam_pk }
        );
        for (const mb of payload.matang_basura) {
          const insert = yield con.Insert(
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
        yield con.Modify(
          `DELETE FROM family_tinubdan_tubig where fam_pk=@fam_pk;`,
          { fam_pk }
        );
        for (const tt of payload.tinubdan_tubig) {
          const insert = yield con.Insert(
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
        yield con.Modify(
          `DELETE FROM family_serbisyo_nadawat where fam_pk=@fam_pk;`,
          { fam_pk }
        );
        for (const sn of payload.serbisyo_nadawat) {
          const insert = yield con.Insert(
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
      yield con.Rollback();
      console.error(`error`, error);
      return {
        success: false,
        message: useErrorMessage_1.ErrorMessage(error),
      };
    }
  });
const getSingleFamily = (ulo_pamilya) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
      yield con.BeginTransaction();
      const all_family = yield con.QuerySingle(
        `
        SELECT * FROM family WHERE ulo_pamilya=@ulo_pamilya;
        `,
        {
          ulo_pamilya: ulo_pamilya,
        }
      );
      all_family.fam_members = yield con.Query(
        `
            SELECT * FROM family_member WHERE fam_pk = @fam_pk
            `,
        {
          fam_pk: all_family.fam_pk,
        }
      );
      for (const fm of all_family.fam_members) {
        fm.resident_info = yield con.QuerySingle(
          `select * from resident where resident_pk = @resident_pk`,
          {
            resident_pk: fm.resident_pk,
          }
        );
        fm.resident_info.pic = yield useFileUploader_1.GetUploadedImage(
          fm.resident_info.pic
        );
      }
      con.Commit();
      return {
        success: true,
        data: all_family,
      };
    } catch (error) {
      yield con.Rollback();
      console.error(`error`, error);
      return {
        success: false,
        message: useErrorMessage_1.ErrorMessage(error),
      };
    }
  });
const getSingleFamByFamPk = (fam_pk) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
      yield con.BeginTransaction();
      const family = yield con.QuerySingle(
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
      family.fam_members = yield con.Query(
        `
            SELECT * FROM family_member WHERE fam_pk = @fam_pk
            `,
        {
          fam_pk,
        }
      );
      for (const fm of family.fam_members) {
        fm.resident_info = yield con.QuerySingle(
          `select * from resident where resident_pk = @resident_pk`,
          {
            resident_pk: fm.resident_pk,
          }
        );
        fm.resident_info.pic = yield useFileUploader_1.GetUploadedImage(
          fm.resident_info.pic
        );
      }
      const tinubdan_tubig = yield con.Query(
        `SELECT descrip FROM family_tinubdan_tubig where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      family.tinubdan_tubig = tinubdan_tubig.map((d) => d.descrip);
      const matang_kasilyas = yield con.Query(
        `SELECT * FROM family_matang_kasilyas where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      family.matang_kasilyas = matang_kasilyas.map((d) => d.descrip);
      const pasilidad_kuryente = yield con.Query(
        `SELECT * FROM family_pasilidad_kuryente where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      family.pasilidad_kuryente = pasilidad_kuryente.map((d) => d.descrip);
      const matang_basura = yield con.Query(
        `SELECT * FROM family_matang_basura where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      family.matang_basura = matang_basura.map((d) => d.descrip);
      const biktima_pangabuso = yield con.Query(
        `SELECT * FROM family_biktima_pangabuso where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      family.biktima_pangabuso = biktima_pangabuso.map((d) => d.descrip);
      const kahimtanang_komunidad = yield con.Query(
        `SELECT * FROM family_kahimtanang_komunidad where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      family.kahimtanang_komunidad = kahimtanang_komunidad.map(
        (d) => d.descrip
      );
      family.serbisyo_nadawat = yield con.Query(
        `  SELECT * FROM family_serbisyo_nadawat where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      con.Commit();
      return {
        success: true,
        data: family,
      };
    } catch (error) {
      yield con.Rollback();
      console.error(`error`, error);
      return {
        success: false,
        message: useErrorMessage_1.ErrorMessage(error),
      };
    }
  });
const getFamilyDataTable = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
      yield con.BeginTransaction();
      console.log(`filters`, payload.filters);
      const all_family = yield con.Query(
        `
      SELECT * FROM 
      (
        SELECT f.*,CONCAT(fu.first_name,' ',fu.last_name) ulo_fam_member,fu.purok ulo_fam_purok FROM family f JOIN
        resident fu ON f.ulo_pamilya = fu.resident_pk
      ) AS tmp
      WHERE
      coalesce(ulo_fam_member,'') LIKE concat('%',@search,'%')
     # AND coalesce(ulo_fam_purok,'') LIKE concat('%',@search,'%')
      order by ${payload.sort.column} ${payload.sort.direction}
      limit ${payload.page.begin},${payload.page.limit + 1};
      `,
        payload.filters
      );
      for (const fam of all_family) {
        fam.ulo_pamilya_info = yield con.QuerySingle(
          `select * from resident where resident_pk=@resident_pk `,
          {
            resident_pk: fam.ulo_pamilya,
          }
        );
        fam.ulo_pamilya_info.pic = yield useFileUploader_1.GetUploadedImage(
          fam.ulo_pamilya_info.pic
        );
      }
      const hasMore = all_family.length > payload.page.limit;
      if (hasMore) {
        all_family.splice(all_family.length - 1, 1);
      }
      const count = hasMore
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
      yield con.Rollback();
      console.error(`error`, error);
      return {
        success: false,
        message: useErrorMessage_1.ErrorMessage(error),
      };
    }
  });
const getFamilyOfResident = (resident_pk) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
      yield con.BeginTransaction();
      const all_family = yield con.QuerySingle(
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
      all_family.ulo_pamilya_info = yield con.QuerySingle(
        `select * from resident where resident_pk=@resident_pk;`,
        {
          resident_pk: all_family.ulo_pamilya,
        }
      );
      if (
        (_a =
          all_family === null || all_family === void 0
            ? void 0
            : all_family.ulo_pamilya_info) === null || _a === void 0
          ? void 0
          : _a.pic
      ) {
        all_family.ulo_pamilya_info.pic =
          yield useFileUploader_1.GetUploadedImage(
            all_family.ulo_pamilya_info.pic
          );
      }
      all_family.fam_members = yield con.Query(
        `
            SELECT * FROM family_member WHERE fam_pk = @fam_pk
            `,
        {
          fam_pk: all_family.fam_pk,
        }
      );
      for (const fm of all_family.fam_members) {
        fm.resident_info = yield con.QuerySingle(
          `select * from resident where resident_pk = @resident_pk`,
          {
            resident_pk: fm.resident_pk,
          }
        );
        fm.resident_info.pic = yield useFileUploader_1.GetUploadedImage(
          fm.resident_info.pic
        );
      }
      con.Commit();
      return {
        success: true,
        data: all_family,
      };
    } catch (error) {
      yield con.Rollback();
      console.error(`error`, error);
      return {
        success: false,
        message: useErrorMessage_1.ErrorMessage(error),
      };
    }
  });
const searchNoFamResident = (search) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
      yield con.BeginTransaction();
      const search_data_set = yield con.Query(
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
        ${useSearch_1.GenerateSearch(search, "label")}
        `,
        null
      );
      con.Commit();
      return {
        success: true,
        data: search_data_set,
      };
    } catch (error) {
      yield con.Rollback();
      console.error(`error`, error);
      return {
        success: false,
        message: useErrorMessage_1.ErrorMessage(error),
      };
    }
  });
const searchFamMember = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
      yield con.BeginTransaction();
      console.log(`payload`, payload);
      const search_data_set = yield con.Query(
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
        ${useSearch_1.GenerateSearch(payload.value, "label")}
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
      yield con.Rollback();
      console.error(`error`, error);
      return {
        success: false,
        message: useErrorMessage_1.ErrorMessage(error),
      };
    }
  });
exports.default = {
  addFamily,
  updateFamily,
  getSingleFamily,
  getFamilyDataTable,
  getFamilyOfResident,
  searchNoFamResident,
  searchFamMember,
  getSingleFamByFamPk,
};
//# sourceMappingURL=FamilyRepository.js.map
