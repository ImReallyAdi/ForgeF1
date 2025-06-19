"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubEventHandler = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
class GithubEventHandler extends forgescript_1.BaseEventHandler {
    register(client) {
        const ext = client.getExtension(__1.ForgeGithub, true);
        const listener = this.listener.bind(client);
        ext["emitter"].on(this.name, listener);
    }
}
exports.GithubEventHandler = GithubEventHandler;
//# sourceMappingURL=GithubEventHandlers.js.map