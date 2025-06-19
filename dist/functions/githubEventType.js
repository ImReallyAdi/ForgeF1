"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
exports.default = new forgescript_1.NativeFunction({
    name: "$githubEventType",
    version: "1.0.0",
    description: "Returns the type of the latest GitHub event",
    brackets: false,
    unwrap: false,
    args: [],
    output: forgescript_1.ArgType.String,
    async execute(ctx) {
        const ext = ctx.getExtension(__1.ForgeGithub, true);
        return this.success(ext.latestEventType || "");
    },
});
//# sourceMappingURL=githubEventType.js.map