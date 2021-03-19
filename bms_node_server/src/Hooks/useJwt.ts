import jwt from "jsonwebtoken";
import { UserClaims } from "../Models/UserModels";

export const CreateToken = async (user: UserClaims) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { user: user },
      process.env.JWT_SECRET_KEY,
      (err: any, token: string) => {
        if (err) {
          // reject(err);
          resolve(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};
