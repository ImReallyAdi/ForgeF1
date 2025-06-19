"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
const GithubEventHandlers_1 = require("../structures/GithubEventHandlers");
exports.default = new GithubEventHandlers_1.GithubEventHandler({
    name: "fork",
    version: "1.0.0",
    description: "Triggered when a fork event is received from GitHub.",
    listener(payload) {
        const commands = this.getExtension(__1.ForgeGithub, true).commands.get("fork");
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
//# sourceMappingURL=fork.js.map