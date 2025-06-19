import { Interpreter } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { GithubEventHandler } from "../structures/GithubEventHandlers";

export default new GithubEventHandler({
  name: "project_card",
  version: "1.0.0",
  description:
    "Triggered when a project card is created, moved, edited, or deleted.",
  listener(payload) {
    const commands = this.getExtension(ForgeGithub, true).commands.get(
      "project_card",
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
