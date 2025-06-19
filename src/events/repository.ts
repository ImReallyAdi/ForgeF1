import { Interpreter } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { GithubEventHandler } from "../structures/GithubEventHandlers";

export default new GithubEventHandler({
  name: "repository",
  version: "1.0.0",
  description:
    "Triggered when a repository is created, renamed, archived, or transferred.",
  listener(payload) {
    const commands = this.getExtension(ForgeGithub, true).commands.get(
      "repository",
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
