"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidDateToDefault = exports.parseInvalidTimeToDefault = exports.sqlFilterNumber = exports.sqlFilterDate = exports.parseInvalidDateToDefault = void 0;
const moment_1 = __importDefault(require("moment"));
const parseInvalidDateToDefault = (date, defaultString) => {
    const d = (0, moment_1.default)(date);
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
    if (!!date) {
        const d = (0, moment_1.default)(date);
        if (d.isValid()) {
            return `'${d.format("YYYY-MM-DD")}'`;
        }
    }
    return column;
};
exports.sqlFilterDate = sqlFilterDate;
const sqlFilterNumber = (num, column) => {
    try {
        if (!!num) {
            let parse_num = null;
            if (typeof num === "string") {
                parse_num = parseInt(num);
            }
            if (!isNaN(parse_num)) {
                return `'${parse_num}'`;
            }
        }
        return column;
    }
    catch (error) {
        return column;
    }
};
exports.sqlFilterNumber = sqlFilterNumber;
const parseInvalidTimeToDefault = (date, defaultString) => {
    const d = (0, moment_1.default)(date, "hh:mm A");
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
const InvalidDateToDefault = (date, defaultString) => {
    if (!date) {
        return defaultString;
    }
    const d = (0, moment_1.default)(date).format("MMM DD, YYYY");
    if (d.toLowerCase() === "invalid date") {
        return defaultString;
    }
    return d;
};
exports.InvalidDateToDefault = InvalidDateToDefault;
//# sourceMappingURL=useDateParser.js.map