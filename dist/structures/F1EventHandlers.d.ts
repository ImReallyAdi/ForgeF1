import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { RaceWeekendEvent, RaceResultEvent, DriverStandingEvent, ConstructorStandingEvent, QualifyingEvent } from "../types/f1";
export interface IF1Events {
    raceWeekend: [RaceWeekendEvent];
    raceResult: [RaceResultEvent];
    driverStanding: [DriverStandingEvent];
    constructorStanding: [ConstructorStandingEvent];
    qualifying: [QualifyingEvent];
    error: [Error];
}
export declare class F1EventHandler<T extends keyof IF1Events> extends BaseEventHandler<IF1Events, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=F1EventHandlers.d.ts.map