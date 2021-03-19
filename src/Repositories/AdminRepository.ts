import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage, UploadImage } from "../Hooks/useFileUploader";
import { isValidPicture } from "../Hooks/useValidator";
import { AdministratorModel } from "../Models/AdministratorModels";
import { PaginationModel } from "../Models/PaginationModel";
import { ResponseModel } from "../Models/ResponseModels";
import { UserModel } from "../Models/UserModels";

const addAdmin = async (
  payload: AdministratorModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const user_payload: UserModel = {
      full_name: `${payload.lastname}, ${payload.firstname}`,
      email: payload.email,
      user_type: "admin",
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

      const admin_payload: AdministratorModel = {
        ...payload,
        user_pk: sql_insert_user.insertedId,
        encoder_pk: user_pk,
      };

      const sql_add_admin = await con.Insert(
        `INSERT INTO administrator SET
         user_pk=@user_pk,
         pic=@pic,
         email=@email,
         phone=@phone,
         firstname=@firstname,
         lastname=@lastname,
         gender=@gender,
         encoder_pk=@encoder_pk;`,
        admin_payload
      );

      if (sql_add_admin.insertedId > 0) {
        con.Commit();
        return {
          success: true,
          message: "The administrator has been added successfully",
        };
      } else {
        con.Rollback();
        return {
          success: false,
          message: "No affected rows while adding the administrator",
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

const updateAdmin = async (
  payload: AdministratorModel,
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

    const admin_payload: AdministratorModel = {
      ...payload,
      encoder_pk: user_pk,
    };

    const sql_edit_admin = await con.Modify(
      `UPDATE administrator SET
         pic=@pic,
         email=@email,
         phone=@phone,
         firstname=@firstname,
         lastname=@lastname,
         gender=@gender
         WHERE
         admin_pk=@admin_pk;`,
      admin_payload
    );

    if (sql_edit_admin > 0) {
      con.Commit();
      return {
        success: true,
        message: "The administrator has been updated successfully",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while updating the administrator",
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

const getAdminDataTable = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<AdministratorModel> = await con.QueryPagination(
      `
      SELECT * FROM (SELECT a.*,CONCAT(firstname,' ',lastname) fullname,s.sts_desc  FROM administrator a 
      LEFT JOIN STATUS s ON s.sts_pk = a.sts_pk) tmp
      WHERE 
      (firstname like concat('%',@search,'%')
      OR lastname like concat('%',@search,'%')
      OR email like concat('%',@search,'%')
      OR phone like concat('%',@search,'%')
      OR sts_desc like concat('%',@search,'%'))
      AND admin_pk != 1
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

const getSingleAdmin = async (admin_pk: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: AdministratorModel = await con.QuerySingle(
      `select * from administrator where admin_pk = @admin_pk`,
      {
        admin_pk,
      }
    );

    data.pic = data.pic = await GetUploadedImage(data.pic);
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
  addAdmin,
  updateAdmin,
  getAdminDataTable,
  getSingleAdmin,
};
