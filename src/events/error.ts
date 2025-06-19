import { Interpreter } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { GithubEventHandler } from "../structures/GithubEventHandlers";

export default new GithubEventHandler({
  name: "error",
  version: "1.0.0",
  description: "Emitted when an error occurs inside the GitHub webhook logic.",
  listener(error) {
    const commands = this.getExtension(ForgeGithub, true).commands.get("error");

    for (const command of commands) {
      Interpreter.run({
        obj: {},
        client: this,
        command,
        data: command.compiled.code,
        extras: error,
      });
    }
  },
});
