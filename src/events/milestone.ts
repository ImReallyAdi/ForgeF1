import { Interpreter } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { GithubEventHandler } from "../structures/GithubEventHandlers";

export default new GithubEventHandler({
  name: "milestone",
  version: "1.0.0",
  description:
    "Triggered when a milestone is created, closed, opened, edited, or deleted.",
  listener(payload) {
    const commands = this.getExtension(ForgeGithub, true).commands.get(
      "milestone",
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
