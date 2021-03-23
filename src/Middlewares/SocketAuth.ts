import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../Configurations/Constants";
import { UserClaims } from "../Models/UserModels";

const SocketAuth = (socket: any, next) => {
  const token = socket?.handshake?.query?.token;
  jwt.verify(token, JWT_SECRET_KEY, (error, claims: any) => {
    if (error) {
      next(new Error("Authentication error"));
    } else {
      if (typeof claims?.user !== "undefined") {
        const user: UserClaims = claims.user;
        socket.user_pk = user.user_pk;
        next();
      }
    }
  });
};

export default SocketAuth;
