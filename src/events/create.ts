import { Interpreter } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { GithubEventHandler } from "../structures/GithubEventHandlers";

export default new GithubEventHandler({
  name: "create",
  version: "1.0.0",
  description: "Triggered when a branch or tag is created.",
  listener(payload) {
    const commands = this.getExtension(ForgeGithub, true).commands.get(
      "create",
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
