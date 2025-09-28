import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { TypedEmitter } from "tiny-typed-emitter";
import { F1CommandManager } from "./structures/F1CommandManager";
import { IF1Events } from "./structures/F1EventHandlers";
export interface IForgeF1Options {
    events?: Array<keyof IF1Events>;
    updateInterval?: number;
}
export type TransformEvents<T> = {
    [P in keyof T]: T[P] extends any[] ? (...args: T[P]) => any : never;
};
export declare class ForgeF1 extends ForgeExtension {
    private readonly options;
    name: string;
    description: string;
    version: any;
    private updateInterval;
    latestEventType: string | null;
    emitter: TypedEmitter<TransformEvents<IF1Events>>;
    commands: F1CommandManager;
    private client;
    private lastRace;
    private nextRace;
    private driverStandings;
    private constructorStandings;
    private qualifyingResults;
    constructor(options: IForgeF1Options);
    getNextRace(): {
        circuit: {
            circuitId: string;
            name: string;
            location: string;
            country: string;
            lat: number;
            lng: number;
        };
        schedule: {
            fp1: string;
            fp2: string;
            fp3?: string | undefined;
            sprint?: string | undefined;
            qualifying: string;
            race: string;
        };
    } | null;
    getLastRaceResults(): {
        position: number;
        driver: {
            driverId: string;
            code: string;
            firstName: string;
            lastName: string;
            nationality: string;
        };
        constructor: {
            constructorId: string;
            name: string;
            nationality: string;
        };
        points: number;
        status: string;
        time?: string | undefined;
        fastestLap?: {
            time: string;
            lap: number;
        } | undefined;
    }[];
    getDriverStandings(): {
        driver: {
            driverId: string;
            code: string;
            firstName: string;
            lastName: string;
            nationality: string;
        };
        position: number;
        points: number;
        wins: number;
    }[];
    getConstructorStandings(): {
        constructor: {
            constructorId: string;
            name: string;
            nationality: string;
        };
        position: number;
        points: number;
        wins: number;
    }[];
    getQualifyingResults(): {
        position: number;
        driver: {
            driverId: string;
            code: string;
            firstName: string;
            lastName: string;
            nationality: string;
        };
        constructor: {
            constructorId: string;
            name: string;
            nationality: string;
        };
        q1?: string | undefined;
        q2?: string | undefined;
        q3?: string | undefined;
    }[];
    private startPolling;
    private updateF1Data;
    init(client: ForgeClient): void;
    load(path: string): void;
    cleanup(): void;
}
//# sourceMappingURL=index.d.ts.map