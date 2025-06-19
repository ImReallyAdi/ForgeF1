import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeGithub } from "..";

export default new NativeFunction({
  name: "$pushCommitCount",
  version: "1.0.0",
  description: "Returns the number of commits in the latest GitHub push event",
  brackets: false,
  unwrap: false,
  args: [],
  output: ArgType.Number,
  async execute(ctx) {
    const ext = ctx.getExtension(ForgeGithub, true);
    if (ext.latestEventType !== "push") return this.success(0);
    return this.success(ext.latestPayload?.commits?.length ?? 0);
  },
});
