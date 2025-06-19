"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
const getProperty_1 = require("../utils/getProperty");
exports.default = new forgescript_1.NativeFunction({
    name: "$newPullRequest",
    version: "1.0.0",
    description: "Returns a value from the new GitHub pull request event payload",
    brackets: true,
    args: [
        {
            name: "property",
            rest: false,
            required: true,
            description: "The property to retrieve from the pull request payload",
            type: forgescript_1.ArgType.String,
        },
    ],
    unwrap: true,
    output: forgescript_1.ArgType.String,
    async execute(ctx, [prop]) {
        const ext = ctx.getExtension(__1.ForgeGithub, true);
        if (ext.latestEventType !== "pull_request")
            return this.success("");
        if (!prop?.trim()) {
            return this.success(JSON.stringify(ext.latestPayload ?? {}));
        }
        const value = (0, getProperty_1.getProperty)(ext.latestPayload ?? {}, prop);
        return this.success(value ?? "");
    },
});
//# sourceMappingURL=newPullRequest.js.map