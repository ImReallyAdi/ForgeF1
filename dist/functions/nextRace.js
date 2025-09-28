"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
exports.default = new forgescript_1.NativeFunction({
    name: "$nextRace",
    version: "1.0.2",
    description: "Gets information about the next F1 race",
    unwrap: true,
    brackets: false,
    args: [],
    output: forgescript_1.ArgType.Json,
    execute(ctx, args) {
        const ext = ctx.client.getExtension(__1.ForgeF1, true);
        if (!ext)
            return this.success(null);
        return this.success(ext.getNextRace()); // returns an object with details.
    }
});
//# sourceMappingURL=nextRace.js.map