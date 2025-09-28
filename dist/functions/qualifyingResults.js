"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
exports.default = new forgescript_1.NativeFunction({
    name: "$qualifyingResults",
    version: "1.0.2",
    description: "Gets qualifying results from the last race weekend",
    unwrap: true,
    brackets: false,
    args: [],
    output: forgescript_1.ArgType.Json,
    execute(ctx, args) {
        const ext = ctx.client.getExtension(__1.ForgeF1, true);
        if (!ext)
            return this.success([]);
        return this.success(ext.getQualifyingResults());
    }
});
//# sourceMappingURL=qualifyingResults.js.map