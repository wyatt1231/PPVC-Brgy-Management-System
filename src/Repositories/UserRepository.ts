import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { CreateToken } from "../Hooks/useJwt";
import { ResponseModel } from "../Models/ResponseModels";
import { UserClaims, UserLogin } from "../Models/UserModels";

export const loginUser = async (payload: UserLogin): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const zxc = await con.QuerySingle(
      `SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'sql6400894';`,
      null
    );

    const user: UserClaims | null = await con.QuerySingle(
      `SELECT user_pk,user_type,allow_login FROM user u WHERE u.password = AES_ENCRYPT(@password,@email)`,
      payload
    );

    if (user) {
      if (user.allow_login === "n") {
        return {
          success: false,
          message: "You are not allowed to login with this account yet.",
        };
      }

      const token = await CreateToken(user);
      if (token) {
        await con.Commit();

        return {
          success: true,
          message: "You have been logged in successfully",
          data: {
            user: user,
            token: token,
          },
        };
      } else {
        await con.Rollback();
        return {
          success: false,
          message: "The server was not able to create a token. ",
        };
      }
    } else {
      await con.Rollback();
      return {
        success: false,
        message: "Incorrent username and/or password.",
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

export const currentUser = async (user_pk: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const user_data = await con.QuerySingle(
      `  SELECT r.pic as picpath,u.user_pk,u.user_type,u.full_name,u.new_user,r.* FROM user u LEFT JOIN resident r ON r.user_pk=u.user_pk
      where u.user_pk = @user_pk
      `,
      {
        user_pk,
      }
    );

    if (user_data.user_type === "admin") {
      const sql_get_pic = await con.QuerySingle(
        `SELECT pic FROM administrator WHERE user_pk=${user_pk} LIMIT 1`,
        null
      );
      user_data.pic = await GetUploadedImage(sql_get_pic?.pic);
    } else if (user_data.user_type === "resident") {
      const sql_get_pic = await con.QuerySingle(
        `SELECT pic FROM resident WHERE user_pk=${user_pk} LIMIT 1`,
        null
      );
      user_data.pic = await GetUploadedImage(sql_get_pic?.pic);
    }

    await con.Commit();
    return {
      success: true,
      data: user_data,
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

export const userinfo = async (user_pk: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const user_data = await con.QuerySingle(
      ` SELECT r.pic as picpath,u.user_pk,u.user_type,u.full_name,u.new_user,f.ulo_pamilya,r.* FROM user u LEFT JOIN resident r ON r.user_pk=u.user_pk LEFT JOIN family f ON f.ulo_pamilya=r.resident_pk
      WHERE u.user_pk = @user_pk
      `,
      {
        user_pk,
      }
    );

    if (user_data.user_type === "admin") {
      const sql_get_pic = await con.QuerySingle(
        `SELECT pic FROM administrator WHERE user_pk=${user_pk} LIMIT 1`,
        null
      );
      user_data.pic = await GetUploadedImage(sql_get_pic?.pic);
    } else if (user_data.user_type === "resident") {
      const sql_get_pic = await con.QuerySingle(
        `SELECT pic FROM resident WHERE user_pk=${user_pk} LIMIT 1`,
        null
      );
      user_data.pic = await GetUploadedImage(sql_get_pic?.pic);
    }

    await con.Commit();
    return {
      success: true,
      data: user_data,
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
