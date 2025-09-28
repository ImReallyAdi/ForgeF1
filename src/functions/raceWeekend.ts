import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeF1 } from "..";

export default new NativeFunction({
  name: "$raceWeekend",
  description: "Gets information about the upcoming race weekend",
  unwrap: true,
  brackets: false,
  output: ArgType.Json,
  execute(ctx, args) {
    const ext = ctx.client.getExtension(ForgeF1, true);
    if (!ext) return this.success(null);

    return this.success(ext.getNextRace());
  },
});
