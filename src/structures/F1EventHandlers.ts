import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { ForgeF1 } from "..";
import {
  RaceWeekendEvent,
  RaceResultEvent,
  DriverStandingEvent,
  ConstructorStandingEvent,
  QualifyingEvent,
} from "../types/f1";

export interface IF1Events {
  raceWeekend: [RaceWeekendEvent];
  raceResult: [RaceResultEvent];
  driverStanding: [DriverStandingEvent];
  constructorStanding: [ConstructorStandingEvent];
  qualifying: [QualifyingEvent];
  error: [Error];
}

export class F1EventHandler<
  T extends keyof IF1Events,
> extends BaseEventHandler<IF1Events, T> {
  register(client: ForgeClient): void {
    const ext = client.getExtension(ForgeF1, true);

    const listener = this.listener.bind(
      client,
    ) as IF1Events[T][0] extends undefined
      ? () => void
      : (arg: IF1Events[T][0]) => void;

    ext["emitter"].on(this.name, listener);
  }
}