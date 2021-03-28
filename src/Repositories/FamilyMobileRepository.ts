
import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { FamilyModel } from "../Models/FamilyModel";
import { ResponseModel } from "../Models/ResponseModels";

const getfamilyexist = async (
    ulo_pamilya: string
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


  export default {
    getfamilyexist,
  };