"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
const GithubEventHandlers_1 = require("../structures/GithubEventHandlers");
exports.default = new GithubEventHandlers_1.GithubEventHandler({
    name: "repository",
    version: "1.0.0",
    description: "Triggered when a repository is created, renamed, archived, or transferred.",
    listener(payload) {
        const commands = this.getExtension(__1.ForgeGithub, true).commands.get("repository");
        for (const command of commands) {
            forgescript_1.Interpreter.run({
                obj: {},
                client: this,
                command,
                data: command.compiled.code,
                extras: payload,
            });
        }
    },
});
//# sourceMappingURL=repository.js.map