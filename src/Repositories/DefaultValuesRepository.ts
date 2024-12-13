import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { CreateToken } from "../Hooks/useJwt";
import { ResponseModel } from "../Models/ResponseModels";
import { UserClaims, UserLogin } from "../Models/UserModels";

const GetBrandLogo = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();

  try {
    await con.BeginTransaction();

    await con.QuerySingle(
      `SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'sql6400894';`,
      null
    );

    return {
      success: false,
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
  GetBrandLogo,
};
