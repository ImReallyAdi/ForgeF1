import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { getProperty } from "../utils/getProperty";

export default new NativeFunction({
  name: "$newPullRequest",
  version: "1.0.0",
  description: "Returns a value from the new GitHub pull request event payload",
  brackets: true,
  args: [
    {
      name: "property",
      rest: false,
      required: true,
      description: "The property to retrieve from the pull request payload",
      type: ArgType.String,
    },
  ],
  unwrap: true,
  output: ArgType.String,
  async execute(ctx, [prop]) {
    const ext = ctx.getExtension(ForgeGithub, true);
    if (ext.latestEventType !== "pull_request") return this.success("");

    if (!prop?.trim()) {
      return this.success(JSON.stringify(ext.latestPayload ?? {}));
    }

    const value = getProperty(ext.latestPayload ?? {}, prop);
    return this.success(value ?? "");
  },
});
