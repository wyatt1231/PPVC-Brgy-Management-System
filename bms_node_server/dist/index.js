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
const ControllerRegistry_1 = require("./Registry/ControllerRegistry");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
exports.app = express_1.default();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    exports.app.use(connect_timeout_1.default(`60s`));
    exports.app.use(haltOnTimedout);
    exports.app.use(body_parser_1.default.json({ limit: "100mb" }));
    exports.app.use(express_fileupload_1.default());
    exports.app.use(express_1.default.static("./"));
    ControllerRegistry_1.ControllerRegistry(exports.app);
    const port = 4050;
    exports.app.listen(port, () => console.log(`listening to port ${port}`));
});
function haltOnTimedout(req, res, next) {
    if (!req.timedout)
        next();
}
main();
//# sourceMappingURL=index.js.map