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

const addMobileResident = async (
    payload: ResidentModel
  ): Promise<ResponseModel> => {
    const con = await DatabaseConnection();
    try {
      await con.BeginTransaction();
  
      const user_payload: UserModel = {
        full_name: `${payload.last_name}, ${payload.first_name}`,
        email: payload.email,
        user_type: "resident",
        encoder_pk:"0"
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

  
export default {
    addMobileResident,

  };