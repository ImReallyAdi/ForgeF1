"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
exports.default = new forgescript_1.NativeFunction({
    name: "$pushCommitCount",
    version: "1.0.0",
    description: "Returns the number of commits in the latest GitHub push event",
    brackets: false,
    unwrap: false,
    args: [],
    output: forgescript_1.ArgType.Number,
    async execute(ctx) {
        const ext = ctx.getExtension(__1.ForgeGithub, true);
        if (ext.latestEventType !== "push")
            return this.success(0);
        return this.success(ext.latestPayload?.commits?.length ?? 0);
    },
});
//# sourceMappingURL=pushCommitCount.js.map