"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInvalidTimeToDefault = exports.sqlFilterDate = exports.parseInvalidDateToDefault = void 0;
const moment_1 = __importDefault(require("moment"));
const parseInvalidDateToDefault = (date, defaultString) => {
    const d = moment_1.default(date);
    if (d.isValid()) {
        return d.format("YYYY-MM-DD");
    }
    else {
        if (typeof defaultString === "string") {
            return defaultString;
        }
        else {
            null;
        }
    }
    return null;
};
exports.parseInvalidDateToDefault = parseInvalidDateToDefault;
const sqlFilterDate = (date, column) => {
    const d = moment_1.default(date);
    if (d.isValid()) {
        return `'${d.format("YYYY-MM-DD")}'`;
    }
    return column;
};
exports.sqlFilterDate = sqlFilterDate;
const parseInvalidTimeToDefault = (date, defaultString) => {
    const d = moment_1.default(date, "hh:mm A");
    if (d.isValid()) {
        return d.format("HH:mm:ss");
    }
    else {
        if (typeof defaultString === "string") {
            return defaultString;
        }
        else {
            null;
        }
    }
    return null;
};
exports.parseInvalidTimeToDefault = parseInvalidTimeToDefault;
//# sourceMappingURL=useDateParser.js.map