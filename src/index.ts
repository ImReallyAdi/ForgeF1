import {
  EventManager,
  ForgeClient,
  ForgeExtension,
} from "@tryforge/forgescript";
import express from "express";
import { TypedEmitter } from "tiny-typed-emitter";
import { app } from "@tryforge/webserver";
import { GithubCommandManager } from "./structures/GithubCommandManager";
import { IGithubEvents } from "./structures/GithubEventHandlers";
import { GithubEventManagerName } from "./constants";
import { PullRequestEvent, PushEvent } from "./types/github";

export interface IForgeGithubOptions {
  auth?: string;
  events?: Array<keyof IGithubEvents>;
  port?: number;
}

export type TransformEvents<T> = {
  [P in keyof T]: T[P] extends any[] ? (...args: T[P]) => any : never;
};

export class ForgeGithub extends ForgeExtension {
  name = "forge.github";
  description =
    "An extension that receives GitHub webhook events like push and PRs.";
  version = require("../package.json").version;

  public latestEventType: string | null = null;
  public latestPayload: Record<string, any> | null = null;

  private client!: ForgeClient;
  public emitter = new TypedEmitter<TransformEvents<IGithubEvents>>();
  public commands!: GithubCommandManager;

  constructor(private readonly options: IForgeGithubOptions) {
    super();

    const server = app(options.port ?? 3050);
    server.use(express.json());

    server.post("/github", (req, res) => {
      const event = req.headers["x-github-event"];
      const payload = req.body;

      if (!event || !payload) return res.status(400).send("Invalid event.");

      // ✅ Save for functions to access
      this.latestEventType = event as string;
      this.latestPayload = payload;

      switch (event) {
        case "push":
          this.emitter.emit("push", payload as PushEvent);
          break;
        case "pull_request":
          this.emitter.emit("pull_request", payload as PullRequestEvent);
          break;
        default:
          console.warn(`[ForgeGithub] Unknown event received: ${event}`);
      }

      res.sendStatus(200);
    });
  }

  init(client: ForgeClient): void {
    this.client = client;
    this.commands = new GithubCommandManager(client);

    EventManager.load(GithubEventManagerName, __dirname + `/events`);
    this.load(__dirname + `/functions`);

    if (this.options.events?.length)
      this.client.events.load(GithubEventManagerName, this.options.events);
  }
}
