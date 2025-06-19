import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeGithub } from "..";

export default new NativeFunction({
  name: "$githubEventType",
  version: "1.0.0",
  description: "Returns the type of the latest GitHub event",
  brackets: false,
  unwrap: false,
  args: [],
  output: ArgType.String,
  async execute(ctx) {
    const ext = ctx.getExtension(ForgeGithub, true);
    return this.success(ext.latestEventType || "");
  },
});
