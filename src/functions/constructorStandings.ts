import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeF1 } from "..";

export default new NativeFunction({
    name: "$constructorStandings",
    description: "Gets current F1 constructor standings",
    unwrap: true,
    brackets: false,
    output: ArgType.Json,
    execute(ctx, args) {
        const ext = ctx.client.getExtension(ForgeF1, true);
        if (!ext) return this.success([]);

        return this.success(ext.getConstructorStandings());
    }
});