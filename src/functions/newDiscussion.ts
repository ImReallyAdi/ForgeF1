import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { getProperty } from "../utils/getProperty";

export default new NativeFunction({
  name: "$newDiscussion",
  version: "1.0.0",
  description: "Returns a value from the new GitHub discussion event payload.",
  brackets: true,
  args: [
    {
      name: "property",
      rest: false,
      required: false,
      description: "The property to retrieve from the discussion payload.",
      type: ArgType.String,
    },
  ],
  unwrap: true,
  output: ArgType.String,
  async execute(ctx, [prop]) {
    const ext = ctx.getExtension(ForgeGithub, true);
    if (ext.latestEventType !== "discussion") return this.success("");
    if (!prop?.trim())
      return this.success(JSON.stringify(ext.latestPayload ?? {}));
    const value = getProperty(ext.latestPayload ?? {}, prop);
    return this.success(value ?? "");
  },
});
