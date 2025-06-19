import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { getProperty } from "../utils/getProperty";

export default new NativeFunction({
  name: "$newFork",
  version: "1.0.0",
  description: "Returns a value from the new GitHub fork event payload",
  brackets: true,
  args: [
    {
      name: "property",
      rest: false,
      required: false,
      description: "The property to retrieve from the fork payload",
      type: ArgType.String,
    },
  ],
  unwrap: true,
  output: ArgType.String,
  async execute(ctx, [prop]) {
    const ext = ctx.getExtension(ForgeGithub, true);
    if (ext.latestEventType !== "fork") return this.success("");
    const payload = ext.latestPayload ?? {};
    if (!prop) return this.success(JSON.stringify(payload));
    return this.success(getProperty(payload, prop) ?? "");
  },
});
