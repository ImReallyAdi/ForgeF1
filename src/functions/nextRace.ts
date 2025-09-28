import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeF1 } from "..";

export default new NativeFunction({
    name: "$nextRace",
    version: "1.0.2",

    description: "Gets information about the next F1 race",
    unwrap: true,
    brackets: false,
    args: [],
    output: ArgType.Json,
    execute(ctx, args) {
        const ext = ctx.client.getExtension(ForgeF1, true);
        if (!ext) return this.success(null);

        return this.success(ext.getNextRace()); // returns an object with details.
    }
});