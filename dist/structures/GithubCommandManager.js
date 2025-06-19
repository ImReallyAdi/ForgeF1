"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubCommandManager = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const constants_1 = require("../constants");
class GithubCommandManager extends forgescript_1.BaseCommandManager {
    handlerName = constants_1.GithubEventManagerName;
}
exports.GithubCommandManager = GithubCommandManager;
//# sourceMappingURL=GithubCommandManager.js.map