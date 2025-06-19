"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
const getProperty_1 = require("../utils/getProperty");
exports.default = new forgescript_1.NativeFunction({
    name: "$newCommit",
    version: "1.0.0",
    description: "Returns commit-related values from the latest push event payload.",
    brackets: true,
    args: [
        {
            name: "property",
            rest: false,
            required: false,
            description: "The property to retrieve from the latest commit (use commits[0].message, etc.).",
            type: forgescript_1.ArgType.String,
        },
    ],
    unwrap: true,
    output: forgescript_1.ArgType.String,
    async execute(ctx, [prop]) {
        const ext = ctx.getExtension(__1.ForgeGithub, true);
        if (ext.latestEventType !== "push")
            return this.success("");
        const commits = ext.latestPayload?.commits;
        if (!commits || !Array.isArray(commits))
            return this.success("");
        if (!prop?.trim()) {
            return this.success(JSON.stringify(commits));
        }
        const value = (0, getProperty_1.getProperty)(commits, prop);
        return this.success(value ?? "");
    },
});
//# sourceMappingURL=newCommit.js.map