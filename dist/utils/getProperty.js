"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProperty = void 0;
function getProperty(obj, path) {
    return path.split(".").reduce((prev, curr) => {
        if (prev && typeof prev === "object") {
            return prev[curr];
        }
        return undefined;
    }, obj);
}
exports.getProperty = getProperty;
//# sourceMappingURL=getProperty.js.map