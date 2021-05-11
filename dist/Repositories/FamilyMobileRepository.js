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
const getfamilyexist = (ulo_pamilya) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
        SELECT f.* FROM family f WHERE f.ulo_pamilya=@ulo_pamilya
        `, {
            ulo_pamilya: ulo_pamilya,
        });
        for (const members of data) {
            members.fam_members = yield con.Query(`
          SELECT fm.*,r.* FROM family_member fm join resident r on fm.resident_pk = r.resident_pk WHERE fm.fam_pk=@fam_pk
        `, {
                fam_pk: members.fam_pk,
            });
        }
        con.Commit();
        return {
            success: true,
            data: data,
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
const getforms = (ulo_pamilya, fam_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`
        SELECT f.* FROM family f WHERE f.ulo_pamilya=@ulo_pamilya
        `, {
            ulo_pamilya: ulo_pamilya,
        });
        const kahimtanang_komunidad = yield con.Query(`SELECT * FROM family_kahimtanang_komunidad where fam_pk = @fam_pk;`, { fam_pk });
        data.kahimtanang_komunidad = kahimtanang_komunidad.map((d) => d.descrip);
        const tinubdan_tubig = yield con.Query(`SELECT descrip FROM family_tinubdan_tubig where fam_pk = @fam_pk;`, { fam_pk });
        data.tinubdan_tubig = tinubdan_tubig.map((d) => d.descrip);
        const matang_kasilyas = yield con.Query(`SELECT * FROM family_matang_kasilyas where fam_pk = @fam_pk;`, { fam_pk });
        data.matang_kasilyas = matang_kasilyas.map((d) => d.descrip);
        const pasilidad_kuryente = yield con.Query(`SELECT * FROM family_pasilidad_kuryente where fam_pk = @fam_pk;`, { fam_pk });
        data.pasilidad_kuryente = pasilidad_kuryente.map((d) => d.descrip);
        const matang_basura = yield con.Query(`SELECT * FROM family_matang_basura where fam_pk = @fam_pk;`, { fam_pk });
        data.matang_basura = matang_basura.map((d) => d.descrip);
        const biktima_pangabuso = yield con.Query(`SELECT * FROM family_biktima_pangabuso where fam_pk = @fam_pk;`, { fam_pk });
        data.biktima_pangabuso = biktima_pangabuso.map((d) => d.descrip);
        data.serbisyo_nadawat = yield con.Query(`  SELECT * FROM family_serbisyo_nadawat where fam_pk = @fam_pk;`, { fam_pk });
        con.Commit();
        return {
            success: true,
            data: data,
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
    getfamilyexist,
    getforms
};
//# sourceMappingURL=FamilyMobileRepository.js.map