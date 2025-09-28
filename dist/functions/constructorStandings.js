"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
exports.default = new forgescript_1.NativeFunction({
    name: "$constructorStandings",
    description: "Gets current F1 constructor standings",
    unwrap: true,
    brackets: false,
    output: forgescript_1.ArgType.Json,
    execute(ctx, args) {
        const ext = ctx.client.getExtension(__1.ForgeF1, true);
        if (!ext)
            return this.success([]);
        return this.success(ext.getConstructorStandings());
    }
});
//# sourceMappingURL=constructorStandings.js.map