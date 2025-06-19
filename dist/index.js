"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeGithub = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const express_1 = __importDefault(require("express"));
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const webserver_1 = require("@tryforge/webserver");
const GithubCommandManager_1 = require("./structures/GithubCommandManager");
const constants_1 = require("./constants");
class ForgeGithub extends forgescript_1.ForgeExtension {
    options;
    name = "forge.github";
    description = "An extension that receives GitHub webhook events like push and PRs.";
    version = require("../package.json").version;
    latestEventType = null;
    latestPayload = null;
    client;
    emitter = new tiny_typed_emitter_1.TypedEmitter();
    commands;
    constructor(options) {
        super();
        this.options = options;
        const server = (0, webserver_1.app)(options.port ?? 3050);
        server.use(express_1.default.json());
        server.post("/github", (req, res) => {
            const event = req.headers["x-github-event"];
            const payload = req.body;
            if (!event || !payload)
                return res.status(400).send("Invalid event.");
            // ✅ Save for functions to access
            this.latestEventType = event;
            this.latestPayload = payload;
            switch (event) {
                case "push":
                    this.emitter.emit("push", payload);
                    break;
                case "pull_request":
                    this.emitter.emit("pull_request", payload);
                    break;
                case "create":
                    this.emitter.emit("create", payload);
                    break;
                case "delete":
                    this.emitter.emit("delete", payload);
                    break;
                case "repository":
                    this.emitter.emit("repository", payload);
                    break;
                case "label":
                    this.emitter.emit("label", payload);
                    break;
                case "milestone":
                    this.emitter.emit("milestone", payload);
                    break;
                case "project":
                    this.emitter.emit("project", payload);
                    break;
                case "project_card":
                    this.emitter.emit("project_card", payload);
                    break;
                case "fork":
                    this.emitter.emit("fork", payload);
                    break;
                case "star":
                    this.emitter.emit("star", payload);
                    break;
                case "release":
                    this.emitter.emit("release", payload);
                    break;
                case "issue_comment":
                    this.emitter.emit("issue_comment", payload);
                    break;
                case "pull_request_review":
                    this.emitter.emit("pull_request_review", payload);
                    break;
                case "discussion":
                    this.emitter.emit("discussion", payload);
                    break;
                case "issues":
                    this.emitter.emit("issues", payload);
                    break;
                default:
                    console.warn(`[ForgeGithub] Unknown event received: ${event}`);
            }
            res.sendStatus(200);
        });
    }
    init(client) {
        this.client = client;
        this.commands = new GithubCommandManager_1.GithubCommandManager(client);
        forgescript_1.EventManager.load(constants_1.GithubEventManagerName, __dirname + `/events`);
        this.load(__dirname + `/functions`);
        if (this.options.events?.length)
            this.client.events.load(constants_1.GithubEventManagerName, this.options.events);
    }
}
exports.ForgeGithub = ForgeGithub;
//# sourceMappingURL=index.js.map