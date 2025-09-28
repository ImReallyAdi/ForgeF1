"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.F1EventHandler = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
class F1EventHandler extends forgescript_1.BaseEventHandler {
    register(client) {
        const ext = client.getExtension(__1.ForgeF1, true);
        const listener = this.listener.bind(client);
        ext["emitter"].on(this.name, listener);
    }
}
exports.F1EventHandler = F1EventHandler;
//# sourceMappingURL=F1EventHandlers.js.map