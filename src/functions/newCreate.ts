import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { getProperty } from "../utils/getProperty";

export default new NativeFunction({
  name: "$newCreate",
  version: "1.0.0",
  description:
    "Returns a value from the GitHub create (branch/tag) event payload",
  brackets: true,
  args: [
    {
      name: "property",
      rest: false,
      type: ArgType.String,
      required: false,
      description: "The property to retrieve from the create event payload",
    },
  ],
  unwrap: true,
  output: ArgType.String,
  async execute(ctx, [prop]) {
    const ext = ctx.getExtension(ForgeGithub, true);
    if (ext.latestEventType !== "create") return this.success("");
    if (!prop)
      return this.success(JSON.stringify(ext.latestPayload ?? {}, null, 2));
    const value = getProperty(ext.latestPayload ?? {}, prop);
    return this.success(value ?? "");
  },
});
