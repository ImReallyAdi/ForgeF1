import { Interpreter } from "@tryforge/forgescript";
import { ForgeGithub } from "..";
import { GithubEventHandler } from "../structures/GithubEventHandlers";

export default new GithubEventHandler({
  name: "pull_request_review",
  version: "1.0.0",
  description: "Triggered when a review is submitted on a pull request.",
  listener(payload) {
    const commands = this.getExtension(ForgeGithub, true).commands.get(
      "pull_request_review",
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
