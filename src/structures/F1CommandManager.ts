import { BaseCommandManager } from "@tryforge/forgescript";
import { IF1Events } from "./F1EventHandlers";
import { F1EventManagerName } from "../constants";

export class F1CommandManager extends BaseCommandManager<
  keyof IF1Events
> {
  handlerName = F1EventManagerName;
}