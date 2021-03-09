import BodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import { ControllerRegistry } from "./Registry/ControllerRegistry";
import FileUpload from "express-fileupload";
import timeout from "connect-timeout";
export const app = express();

const main = async () => {
  dotenv.config();

  app.use(timeout(`60s`));
  app.use(haltOnTimedout);
  app.use(BodyParser.json({ limit: "100mb" }));
  app.use(FileUpload());
  app.use(express.static("./"));
  ControllerRegistry(app);

  const port = 4050;

  app.listen(port, () => console.log(`listening to port ${port}`));
};

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

main();
