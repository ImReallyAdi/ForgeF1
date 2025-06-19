import { Interpreter } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { GithubEventHandler } from "../structures/GithubEventHandlers";

export default new GithubEventHandler({
  name: "issue_comment",
  version: "1.0.0",
  description:
    "Triggered when a comment is created on an issue or pull request.",
  listener(payload) {
    const commands = this.getExtension(ForgeGithub, true).commands.get(
      "issue_comment",
    );

    for (const command of commands) {
      Interpreter.run({
        obj: {},
        client: this,
        command,
        data: command.compiled.code,
        extras: payload,
      });
    }
  },
});
