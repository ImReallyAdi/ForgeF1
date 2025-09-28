import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeF1 } from "..";

export default new NativeFunction({
    name: "$lastRaceResults",
    version: "1.0.2",
    description: "Gets results from the last F1 race",
    unwrap: true,
    brackets: false,
    args: [],
    output: ArgType.Json,
    execute(ctx, args) {
        const ext = ctx.client.getExtension(ForgeF1, true);
        if (!ext) return this.success([]);

        return this.success(ext.getLastRaceResults());
    }
});