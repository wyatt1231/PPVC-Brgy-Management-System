import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { BarangayOfficialModel } from "../Models/BarangayOfficialModels";
import { PaginationModel } from "../Models/PaginationModel";
import { ResponseModel } from "../Models/ResponseModels";

const addBarangayOfficial = async (
  payload: BarangayOfficialModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.encoder_pk = user_pk;

    const count_existing = await con.QuerySingle(
      `SELECT COUNT(*) AS total FROM barangay_official WHERE resident_pk = @resident_pk AND sts_pk = 'A'  LIMIT 1;`,
      {
        resident_pk: payload.resident_pk,
      }
    );

    if (parseInt(count_existing.total) > 0) {
      con.Rollback();
      return {
        success: false,
        message:
          "You cannot set this resident as Brgy. Official because he/she has an existing brgy. official position",
      };
    } else {
      const sql_add_brgy_official = await con.Insert(
        `INSERT INTO barangay_official SET
           resident_pk=@resident_pk,
           position=@position,
           encoder_pk=@encoder_pk;`,
        payload
      );

      if (sql_add_brgy_official.insertedId > 0) {
        con.Commit();
        return {
          success: true,
          message:
            "The position has been granted to the brgy. official successfully",
        };
      } else {
        con.Rollback();
        return {
          success: false,
          message: "No affected rows in the process",
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

const removeBarangayOfficial = async (
  official_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_update = await con.Modify(
      `
          UPDATE barangay_official SET
          sts_pk='X'
          where official_pk=@official_pk;
          ;
           `,
      {
        official_pk: official_pk,
      }
    );

    if (sql_update > 0) {
      con.Commit();
      return {
        success: true,
        message: "The barangay official has been deactivated successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while updating the record",
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

const getBrgyOfficialDataTable = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<BarangayOfficialModel> = await con.QueryPagination(
      `
      SELECT * FROM 
      (SELECT r.first_name,r.resident_pk,r.middle_name,r.last_name,r.suffix,r.pic,r.gender,bo.official_pk,bo.position,bo.encoded_at,bo.sts_pk,s.sts_backgroundColor,s.sts_color,s.sts_desc FROM barangay_official bo 
      JOIN resident r ON bo.resident_pk = r.resident_pk
      LEFT JOIN status s ON s.sts_pk = bo.sts_pk) tmp
      WHERE 
      
      first_name like concat('%',@first_name,'%')
      AND last_name like concat('%',@last_name,'%')
      AND gender IN @gender
      AND sts_pk <> 'X'
      AND sts_pk IN @sts_pk
      `,
      payload
    );

    const hasMore: boolean = data.length > payload.page.limit;

    if (hasMore) {
      data.splice(data.length - 1, 1);
    }

    const count: number = hasMore
      ? -1
      : payload.page.begin * payload.page.limit + data.length;

    for (const admin of data) {
      admin.pic = await GetUploadedImage(admin.pic);
    }

    con.Commit();
    return {
      success: true,
      data: {
        table: data,
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

const getBrgyOfficialList = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<BarangayOfficialModel> = await con.Query(
      `
      SELECT * FROM 
      (SELECT r.first_name,r.middle_name,r.last_name,r.suffix,r.pic,r.gender,bo.position,bo.rank,bo.encoded_at,bo.sts_pk,s.sts_backgroundColor,s.sts_color,s.sts_desc FROM barangay_official bo 
      JOIN resident r ON bo.resident_pk = r.resident_pk
      LEFT JOIN STATUS s ON s.sts_pk = bo.sts_pk) tmp ORDER BY bo.rank ASC
      `,
      null
    );

    for (const admin of data) {
      admin.pic = await GetUploadedImage(admin.pic);
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
  getBrgyOfficialList,
  addBarangayOfficial,
  getBrgyOfficialDataTable,
  removeBarangayOfficial,
};
