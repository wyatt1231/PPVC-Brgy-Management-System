"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConfig_1 = require("../Configurations/DatabaseConfig");
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const useFileUploader_1 = require("../Hooks/useFileUploader");
const addFamily = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        if (payload.fam_pk) {
            console.log(`fam  pk`);
        }
        else {
            console.log(` none fam pk`);
        }
        const found_ulo_pamilya = yield con.QuerySingle(`SELECT fam_pk FROM family WHERE ulo_pamilya = @ulo_pamilya;`, {
            ulo_pamilya: payload.ulo_pamilya,
        });
        if (found_ulo_pamilya === null || found_ulo_pamilya === void 0 ? void 0 : found_ulo_pamilya.fam_pk) {
            payload.fam_pk = found_ulo_pamilya.fam_pk;
            const sql_update_fam = yield con.Insert(`UPDATE family SET
          okasyon_balay = @okasyon_balay,
          straktura = @straktura,
          kadugayon_pagpuyo = @kadugayon_pagpuyo,
          okasyon_yuta = @okasyon_yuta,
          kaligon_balay = @kaligon_balay
          WHERE fam_pk=@fam_pk;
          `, payload);
            const truncate_fam_members = yield con.Modify(`Delete  from family_member where fam_pk=@fam_pk;`, {
                fam_pk: payload.fam_pk,
            });
            for (const fam of payload.fam_members) {
<<<<<<< HEAD
                fam.encoded_by = payload.encoded_by;
                fam.fam_pk = payload.fam_pk;
=======
                fam.fam_pk = sql_add_fam.insertedId;
                fam.encoded_by = payload.encoded_by;
>>>>>>> 158ff8ebfca762a1bf456943593e8a734043057a
                const sql_add_fam_member = yield con.Insert(`INSERT INTO family_member SET
              fam_pk = @fam_pk,
              resident_pk = @resident_pk,
              rel = @rel,
              encoded_by = @encoded_by;
              `, fam);
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
        }
        else {
            const sql_add_fam = yield con.Insert(`INSERT INTO family SET
          ulo_pamilya = @ulo_pamilya,
          okasyon_balay = @okasyon_balay,
          straktura = @straktura,
          kadugayon_pagpuyo = @kadugayon_pagpuyo,
          okasyon_yuta = @okasyon_yuta,
          kaligon_balay = @kaligon_balay,
          encoded_by = @encoded_by;
          `, payload);
            if (sql_add_fam.insertedId > 0) {
                for (const fam of payload.fam_members) {
                    fam.encoded_by = payload.encoded_by;
                    fam.fam_pk = sql_add_fam.insertedId;
                    const sql_add_fam_member = yield con.Insert(`INSERT INTO family_member SET
                fam_pk = @fam_pk,
                resident_pk = @resident_pk,
                rel = @rel,
                encoded_by = @encoded_by;
                `, fam);
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
            }
            else {
                con.Rollback();
                return {
                    success: false,
                    message: "No affected rows while creating the news",
                };
            }
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getSingleFamily = (ulo_pamilya) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const all_family = yield con.QuerySingle(`
        SELECT * FROM family WHERE ulo_pamilya=@ulo_pamilya;
        `, {
            ulo_pamilya: ulo_pamilya,
        });
        all_family.fam_members = yield con.Query(`
            SELECT * FROM family_member WHERE fam_pk = @fam_pk
            `, {
            fam_pk: all_family.fam_pk,
        });
        for (const fm of all_family.fam_members) {
            fm.resident_info = yield con.QuerySingle(`select * from resident where resident_pk = @resident_pk`, {
                resident_pk: fm.resident_pk,
            });
            fm.resident_info.pic = yield useFileUploader_1.GetUploadedImage(fm.resident_info.pic);
        }
        con.Commit();
        return {
            success: true,
            data: all_family,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getAllFamily = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const all_family = yield con.Query(`
        SELECT * FROM family;
        `, null);
        for (const fam of all_family) {
            fam.ulo_pamilya_info = yield con.QuerySingle(`select * from resident where resident_pk=@resident_pk;`, {
                resident_pk: fam.ulo_pamilya,
            });
            fam.ulo_pamilya_info.pic = yield useFileUploader_1.GetUploadedImage(fam.ulo_pamilya_info.pic);
            fam.fam_members = yield con.Query(`
              SELECT * FROM family_member WHERE fam_pk = @fam_pk
              `, {
                fam_pk: fam.fam_pk,
            });
            for (const fm of fam.fam_members) {
                fm.resident_info = yield con.QuerySingle(`select * from resident where resident_pk = @resident_pk`, {
                    resident_pk: fm.resident_pk,
                });
                fm.resident_info.pic = yield useFileUploader_1.GetUploadedImage(fm.resident_info.pic);
            }
        }
        con.Commit();
        return {
            success: true,
            data: all_family,
        };
    }
    catch (error) {
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
    getSingleFamily,
    getAllFamily,
};
//# sourceMappingURL=FamilyRepository.js.map