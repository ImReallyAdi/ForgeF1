import { Interpreter } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { GithubEventHandler } from "../structures/GithubEventHandlers";

export default new GithubEventHandler({
  name: "label",
  version: "1.0.0",
  description: "Triggered when a label is created, edited, or deleted.",
  listener(payload) {
    const commands = this.getExtension(ForgeGithub, true).commands.get("label");
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
