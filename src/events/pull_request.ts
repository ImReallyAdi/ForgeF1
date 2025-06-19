import { Interpreter } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { GithubEventHandler } from "../structures/GithubEventHandlers";

export default new GithubEventHandler({
  name: "pull_request",
  version: "1.0.0",
  description: "Triggered when a pull request event is received from GitHub.",
  listener(payload) {
    const commands = this.getExtension(ForgeGithub, true).commands.get(
      "pull_request",
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
