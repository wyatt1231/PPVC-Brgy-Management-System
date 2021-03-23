import { Server } from "socket.io";
import ComplaintChatSocket from "../Sockets/ComplaintChatSocket";

export const SocketRegistry = (server: Server) => {
  ComplaintChatSocket(server);
};

export default SocketRegistry;
