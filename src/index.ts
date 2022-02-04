import BodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import FileUpload from "express-fileupload";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { ControllerRegistry } from "./Registry/ControllerRegistry";
import SocketRegistry from "./Registry/SocketRegistry";
export const app = express();

const main = async () => {
  dotenv.config();

  //test

  app.use(BodyParser.json({ limit: "100mb" }));
  app.use(FileUpload());

  app.use(express.static("./"));

  const server = http.createServer(app);
  const socketServer = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  ControllerRegistry(app);
  SocketRegistry(socketServer);

  app.use(
    "/static",
    express.static(path.join(__dirname, "../client/build//static"))
  );

  app.get("*", function (req, res) {
    res.sendFile("index.html", {
      root: path.join(__dirname, "../client/build/"),
    });
  });

  const PORT = process.env.PORT || 8080;
  // const PORT = 8080;
  server.listen(PORT, () => console.log(`listening to ports ${PORT}`));
};

main();
