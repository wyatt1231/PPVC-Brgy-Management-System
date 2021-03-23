"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketRegistry = void 0;
const ComplaintChatSocket_1 = __importDefault(require("../Sockets/ComplaintChatSocket"));
const SocketRegistry = (server) => {
    ComplaintChatSocket_1.default(server);
};
exports.SocketRegistry = SocketRegistry;
exports.default = exports.SocketRegistry;
//# sourceMappingURL=SocketRegistry.js.map