import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeF1 } from "..";

export default new NativeFunction({
  name: "$raceResults",
  description: "Gets results from the last F1 race",
  unwrap: true,
  brackets: false,
  output: ArgType.Json,
  execute(ctx, args) {
    const ext = ctx.client.getExtension(ForgeF1, true);
    if (!ext) return this.success([]);

    return this.success(ext.getLastRaceResults());
  },
});
