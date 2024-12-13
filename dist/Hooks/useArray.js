"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Unique = (a) => {
    var seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
};
exports.default = {
    Unique,
};
//# sourceMappingURL=useArray.js.map