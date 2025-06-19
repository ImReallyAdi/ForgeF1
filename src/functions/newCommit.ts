import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { getProperty } from "../utils/getProperty";

export default new NativeFunction({
  name: "$newCommit",
  version: "1.0.0",
  description:
    "Returns commit-related values from the latest push event payload.",
  brackets: true,
  args: [
    {
      name: "property",
      rest: false,
      required: false,
      description:
        "The property to retrieve from the latest commit (use commits[0].message, etc.).",
      type: ArgType.String,
    },
  ],
  unwrap: true,
  output: ArgType.String,
  async execute(ctx, [prop]) {
    const ext = ctx.getExtension(ForgeGithub, true);
    if (ext.latestEventType !== "push") return this.success("");
    const commits = ext.latestPayload?.commits;
    if (!commits || !Array.isArray(commits)) return this.success("");

    if (!prop?.trim()) {
      return this.success(JSON.stringify(commits));
    }

    const value = getProperty(commits, prop);
    return this.success(value ?? "");
  },
});
