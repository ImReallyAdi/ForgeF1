"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
const GithubEventHandlers_1 = require("../structures/GithubEventHandlers");
exports.default = new GithubEventHandlers_1.GithubEventHandler({
    name: "milestone",
    version: "1.0.0",
    description: "Triggered when a milestone is created, closed, opened, edited, or deleted.",
    listener(payload) {
        const commands = this.getExtension(__1.ForgeGithub, true).commands.get("milestone");
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
//# sourceMappingURL=milestone.js.map