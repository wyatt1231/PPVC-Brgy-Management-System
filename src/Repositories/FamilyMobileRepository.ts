
import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { FamilyModel } from "../Models/FamilyModel";
import { ResponseModel } from "../Models/ResponseModels";

const getfamilyexist = async (
    ulo_pamilya: string,
  ): Promise<ResponseModel> => {
    const con = await DatabaseConnection();
    try {
      await con.BeginTransaction();
  
      const data: Array<FamilyModel> = await con.Query(
        `
        SELECT f.* FROM family f WHERE f.ulo_pamilya=@ulo_pamilya
        `,
        {
            ulo_pamilya: ulo_pamilya,
        }
      );
    for (const members of data) {
        members.fam_members = await con.Query(
          `
          SELECT fm.*,r.* FROM family_member fm join resident r on fm.resident_pk = r.resident_pk WHERE fm.fam_pk=@fam_pk
        `,
          {
            fam_pk: members.fam_pk,
          }
        );
      }
   
  
      con.Commit();
      return {
        success: true,
        data: data,
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

const getforms = async (
    ulo_pamilya: string,
    fam_pk: string,
  ): Promise<ResponseModel> => {
    const con = await DatabaseConnection();
    try {
      await con.BeginTransaction();
  
      const data: FamilyModel = await con.QuerySingle(
        `
        SELECT f.* FROM family f WHERE f.ulo_pamilya=@ulo_pamilya
        `,
        {
            ulo_pamilya: ulo_pamilya,
        }
      );
      const kahimtanang_komunidad = await con.Query(
        `SELECT * FROM family_kahimtanang_komunidad where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      
      data.kahimtanang_komunidad = kahimtanang_komunidad.map((d) => d.descrip);
  
      const tinubdan_tubig = await con.Query(
        `SELECT descrip FROM family_tinubdan_tubig where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      data.tinubdan_tubig = tinubdan_tubig.map((d) => d.descrip);
  
      const matang_kasilyas = await con.Query(
        `SELECT * FROM family_matang_kasilyas where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      data.matang_kasilyas = matang_kasilyas.map((d) => d.descrip);
  
      const pasilidad_kuryente = await con.Query(
        `SELECT * FROM family_pasilidad_kuryente where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      data.pasilidad_kuryente = pasilidad_kuryente.map((d) => d.descrip);
  
      const matang_basura = await con.Query(
        `SELECT * FROM family_matang_basura where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      data.matang_basura = matang_basura.map((d) => d.descrip);
  
      const biktima_pangabuso = await con.Query(
        `SELECT * FROM family_biktima_pangabuso where fam_pk = @fam_pk;`,
        { fam_pk }
      );
      data.biktima_pangabuso = biktima_pangabuso.map((d) => d.descrip);
  
   
      data.serbisyo_nadawat = await con.Query(
        `  SELECT * FROM family_serbisyo_nadawat where fam_pk = @fam_pk;`,
        { fam_pk }
      );
   
  
      con.Commit();
      return {
        success: true,
        data: data,
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
    getfamilyexist,
    getforms
  };