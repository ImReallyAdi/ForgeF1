import { BaseCommandManager } from "@tryforge/forgescript";
import { IGithubEvents } from "./GithubEventHandlers";
import { GithubEventManagerName } from "../constants";

export class GithubCommandManager extends BaseCommandManager<
  keyof IGithubEvents
> {
  handlerName = GithubEventManagerName;
}
