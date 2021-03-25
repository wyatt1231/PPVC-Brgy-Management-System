import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { parseInvalidDateToDefault } from "../Hooks/useDateParser";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage, UploadImage } from "../Hooks/useFileUploader";
import { GenerateSearch } from "../Hooks/useSearch";
import { isValidPicture } from "../Hooks/useValidator";
import { PaginationModel } from "../Models/PaginationModel";
import { ResidentModel } from "../Models/ResidentModels";
import { ResponseModel } from "../Models/ResponseModels";
import { UserModel } from "../Models/UserModels";

const addResident = async (
  payload: ResidentModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const user_payload: UserModel = {
      full_name: `${payload.last_name}, ${payload.first_name}`,
      email: payload.email,
      user_type: "resident",
      encoder_pk: user_pk,
    };

    const sql_insert_user = await con.Insert(
      `INSERT user SET
      email=@email,
      password=AES_ENCRYPT(@email,@email),
      user_type=@user_type,
      full_name=@full_name,
      encoder_pk=@encoder_pk;
      `,
      user_payload
    );

    if (sql_insert_user.insertedId > 0) {
      if (isValidPicture(payload.pic)) {
        const upload_result = await UploadImage({
          base_url: "./src/Storage/Files/Images/",
          extension: "jpg",
          file_name: sql_insert_user.insertedId,
          file_to_upload: payload.pic,
        });

        if (upload_result.success) {
          payload.pic = upload_result.data;
        } else {
          return upload_result;
        }
      }

      const resident_payload: ResidentModel = {
        ...payload,
        user_pk: sql_insert_user.insertedId,
        encoder_pk: user_pk,
        birth_date: parseInvalidDateToDefault(payload.birth_date),
      };

      const sql_add_resident = await con.Insert(
        `INSERT INTO resident SET
         user_pk=@user_pk,
         pic=@pic,              
         first_name=@first_name,       
         middle_name=@middle_name,      
         last_name=@last_name,        
         suffix=@suffix,           
         gender=@gender,           
         birth_date=@birth_date,       
         nationality=@nationality,      
         religion=@religion,         
         civil_status=@civil_status,  
         purok=@purok,   
         phone=@phone,    
         email=@email,  
         dialect=@dialect,          
         tribe=@tribe,            
         with_disability=@with_disability,  
         is_employed=@is_employed,      
         employment=@employment,       
         house_income=@house_income,     
         house_status=@house_status,     
         voting_precinct=@voting_precinct,  
         house_ownership=@house_ownership,  
         sts_pk='A',
         encoder_pk=@encoder_pk;`,
        resident_payload
      );

      if (sql_add_resident.insertedId > 0) {
        con.Commit();
        return {
          success: true,
          message: "The resident has been added successfully",
        };
      } else {
        con.Rollback();
        return {
          success: false,
          message: "No affected rows while adding the resident",
        };
      }
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while adding the user",
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

const updateResident = async (
  payload: ResidentModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    if (isValidPicture(payload.pic)) {
      const upload_result = await UploadImage({
        base_url: "./src/Storage/Files/Images/",
        extension: "jpg",
        file_name: payload.user_pk,
        file_to_upload: payload.pic,
      });

      if (upload_result.success) {
        payload.pic = upload_result.data;
      } else {
        return upload_result;
      }
    }

    const resident_payload: ResidentModel = {
      ...payload,
      encoder_pk: user_pk,
    };

    const sql_edit_resident = await con.Modify(
      `UPDATE resident SET
        first_name=@first_name,       
        middle_name=@middle_name,      
        last_name=@last_name,        
        prefix=@prefix,           
        gender=@gender,           
        birth_date=@birth_date,       
        nationality=@nationality,      
        religion=@religion,         
        civil_status=@civil_status,  
        dialect=@dialect,          
        tribe=@tribe,  
        with_disability=@with_disability,  

        purok=@purok,   
        phone=@phone,    
        email=@email,  
        voting_precinct=@voting_precinct,  

        is_employed=@is_employed,      
        employment=@employment,       
        house_income=@house_income,     
        house_status=@house_status,     
        house_ownership=@house_ownership,  
        encoder_pk=@encoder_pk
        WHERE resident_pk=@resident_pk;`,
      resident_payload
    );

    if (sql_edit_resident > 0) {
      con.Commit();
      return {
        success: true,
        message: "The resident has been updated successfully",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while updating the resident",
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

const getDataTableResident = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<ResidentModel> = await con.QueryPagination(
      `
      SELECT * FROM (SELECT r.*,CONCAT(r.first_name,' ',r.last_name) fullname,s.sts_desc,s.sts_color,s.sts_backgroundColor  FROM resident r 
      LEFT JOIN status s ON s.sts_pk = r.sts_pk) tmp
      WHERE 
      first_name like concat('%',@search,'%')
      OR last_name like concat('%',@search,'%')
      OR fullname like concat('%',@search,'%')
      OR civil_status like concat('%',@search,'%')
      OR religion like concat('%',@search,'%')
      OR nationality like concat('%',@search,'%')
      OR phone like concat('%',@search,'%')
      OR email like concat('%',@search,'%')
      OR sts_desc like concat('%',@search,'%')
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

    for (const row of data) {
      row.pic = await GetUploadedImage(row.pic);
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

const getSingleResident = async (
  resident_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data = await con.QuerySingle(
      `SELECT r.*,CONCAT(r.first_name,' ',r.last_name) fullname,s.sts_desc  FROM resident a 
      LEFT JOIN status s ON s.sts_pk = a.sts_pk where r.resident_pk =@resident_pk`,
      {
        resident_pk: resident_pk,
      }
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

const searchResident = async (search: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data = await con.Query(
      `select resident_pk id, concat(last_name,' ',first_name) label from resident
       ${GenerateSearch(search, "concat(last_name,' ',first_name)")}
      `,
      {
        search,
      }
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
  addResident,
  updateResident,
  getDataTableResident,
  getSingleResident,
  searchResident,
};
