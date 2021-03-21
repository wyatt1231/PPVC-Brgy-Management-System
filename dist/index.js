"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const ControllerRegistry_1 = require("./Registry/ControllerRegistry");
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
exports.app = express_1.default();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    exports.app.use(body_parser_1.default.json({ limit: "100mb" }));
    exports.app.use(express_fileupload_1.default());
    exports.app.use(express_1.default.static("./"));
    const server = http_1.default.createServer(exports.app);
    const socketServer = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
        },
    });
    ControllerRegistry_1.ControllerRegistry(exports.app);
    if (process.env.NODE_ENV === "production") {
        exports.app.use("/static", express_1.default.static(path_1.default.join(__dirname, "../client/build//static")));
        exports.app.get("*", function (req, res) {
            res.sendFile("index.html", {
                root: path_1.default.join(__dirname, "../client/build/"),
            });
        });
    }
    const PORT = process.env.PORT || 4050;
    server.listen(PORT, () => console.log(`listening to ports ${PORT}`));
});
main();
//# sourceMappingURL=index.js.map