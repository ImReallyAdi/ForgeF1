import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { getProperty } from "../utils/getProperty";

export default new NativeFunction({
  name: "$newIssue",
  version: "1.0.0",
  description: "Returns a value from the new GitHub issues event payload.",
  brackets: true,
  args: [
    {
      name: "property",
      rest: false,
      required: false,
      description: "The property to retrieve from the issue payload.",
      type: ArgType.String,
    },
  ],
  unwrap: true,
  output: ArgType.String,
  async execute(ctx, [prop]) {
    const ext = ctx.getExtension(ForgeGithub, true);
    if (ext.latestEventType !== "issues") return this.success("");
    if (!prop?.trim()) {
      return this.success(JSON.stringify(ext.latestPayload ?? {}));
    }
    const value = getProperty(ext.latestPayload ?? {}, prop);
    return this.success(value ?? "");
  },
});
