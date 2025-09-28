import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeF1 } from "..";

export default new NativeFunction({
    name: "$driverStandings",
    version: "1.0.2",

    description: "Gets current F1 driver standings",
    unwrap: true,
    brackets: false,
    args: [],
    output: ArgType.Json,
    execute(ctx, args) {
        const ext = ctx.client.getExtension(ForgeF1, true);
        if (!ext) return this.success([]);

        return this.success(ext.getDriverStandings());
    }
});