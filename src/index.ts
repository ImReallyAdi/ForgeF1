import { EventManager, ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { TypedEmitter } from "tiny-typed-emitter";
import { F1CommandManager } from "./structures/F1CommandManager";
import { IF1Events } from "./structures/F1EventHandlers";
import { F1EventManagerName } from "./constants";

export interface IForgeF1Options {
  events?: Array<keyof IF1Events>;
  updateInterval?: number;
}

export type TransformEvents<T> = {
  [P in keyof T]: T[P] extends any[] ? (...args: T[P]) => any : never;
};

export class ForgeF1 extends ForgeExtension {
  name = "forge.f1";
  description = "An extension that provides Formula 1 racing data and events.";
  version = require("../package.json").version;

  private updateInterval: NodeJS.Timeout | null = null;
  public latestEventType: string | null = null;
  public emitter = new TypedEmitter<TransformEvents<IF1Events>>();
  public commands!: F1CommandManager;
  private client!: ForgeClient;

  private lastRace: {
    results: Array<{
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
      time?: string;
      fastestLap?: {
        time: string;
        lap: number;
      };
    }>;
  } | null = null;

  private nextRace: {
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
      fp3?: string;
      sprint?: string;
      qualifying: string;
      race: string;
    };
  } | null = null;

  private driverStandings: Array<{
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
  }> = [];

  private constructorStandings: Array<{
    constructor: {
      constructorId: string;
      name: string;
      nationality: string;
    };
    position: number;
    points: number;
    wins: number;
  }> = [];

  private qualifyingResults: {
    results: Array<{
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
      q1?: string;
      q2?: string;
      q3?: string;
    }>;
  } | null = null;

  constructor(private readonly options: IForgeF1Options) {
    super();
    this.startPolling(options.updateInterval ?? 60000);
  }

  public getNextRace() {
    return this.nextRace;
  }

  public getLastRaceResults() {
    return this.lastRace?.results ?? [];
  }

  public getDriverStandings() {
    return this.driverStandings;
  }

  public getConstructorStandings() {
    return this.constructorStandings;
  }

  public getQualifyingResults() {
    return this.qualifyingResults?.results ?? [];
  }

  private async startPolling(interval: number) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    await this.updateF1Data();
    this.updateInterval = setInterval(() => this.updateF1Data(), interval);
  }

  private async updateF1Data() {
    try {
      const { default: axios } = await import("axios");
      const currentDate = new Date();
      const currentSeason = currentDate.getFullYear();
      const api = axios.create({
        baseURL: "https://f1api.dev/api",
      });

      // Helper function to make API calls
      const fetchData = async (endpoint: string) => {
        const response = await api.get(endpoint);
        return response.data;
      };

      // 1. Get next race
      const nextRaceData = await fetchData("/races/next");
      if (nextRaceData && nextRaceData.circuit) {
        this.emitter.emit("raceWeekend", {
          circuit: {
            circuitId: nextRaceData.circuit.id,
            name: nextRaceData.circuit.name,
            location: nextRaceData.circuit.location,
            country: nextRaceData.circuit.country,
            lat: parseFloat(nextRaceData.circuit.lat),
            lng: parseFloat(nextRaceData.circuit.lng)
          },
          schedule: {
            fp1: nextRaceData.sessions?.fp1 || "",
            fp2: nextRaceData.sessions?.fp2 || "",
            fp3: nextRaceData.sessions?.fp3 || "",
            sprint: nextRaceData.sessions?.sprint || undefined,
            qualifying: nextRaceData.sessions?.qualifying || "",
            race: nextRaceData.date || ""
          }
        });
        this.nextRace = {
          circuit: {
            circuitId: nextRaceData.circuit.id,
            name: nextRaceData.circuit.name,
            location: nextRaceData.circuit.location,
            country: nextRaceData.circuit.country,
            lat: parseFloat(nextRaceData.circuit.lat),
            lng: parseFloat(nextRaceData.circuit.lng)
          },
          schedule: {
            fp1: nextRaceData.sessions?.fp1 || "",
            fp2: nextRaceData.sessions?.fp2 || "",
            fp3: nextRaceData.sessions?.fp3 || "",
            sprint: nextRaceData.sessions?.sprint || undefined,
            qualifying: nextRaceData.sessions?.qualifying || "",
            race: nextRaceData.date || ""
          }
        };
      }

      // 2. Get last race results
      const lastRaceData = await fetchData("/races/last/results");
      if (lastRaceData && lastRaceData.race && lastRaceData.results) {
        this.emitter.emit("raceResult", {
          season: lastRaceData.race.season,
          round: lastRaceData.race.round,
          raceName: lastRaceData.race.name,
          circuit: {
            circuitId: lastRaceData.race.circuit.id,
            name: lastRaceData.race.circuit.name,
            location: lastRaceData.race.circuit.location,
            country: lastRaceData.race.circuit.country,
            lat: parseFloat(lastRaceData.race.circuit.lat),
            lng: parseFloat(lastRaceData.race.circuit.lng)
          },
          results: lastRaceData.results.map((result: any) => ({
            position: result.position,
            driver: {
              driverId: result.driver.id,
              code: result.driver.code,
              firstName: result.driver.firstName,
              lastName: result.driver.lastName,
              nationality: result.driver.nationality,
              permanentNumber: result.driver.number
            },
            constructor: {
              constructorId: result.constructor.id,
              name: result.constructor.name,
              nationality: result.constructor.nationality
            },
            points: result.points,
            status: result.status,
            time: result.time,
            fastestLap: result.fastestLap ? {
              time: result.fastestLap.time,
              lap: result.fastestLap.lap
            } : undefined
          }))
        });
        this.lastRace = {
          results: lastRaceData.results.map((result: any) => ({
            position: result.position,
            driver: {
              driverId: result.driver.id,
              code: result.driver.code,
              firstName: result.driver.firstName,
              lastName: result.driver.lastName,
              nationality: result.driver.nationality,
              permanentNumber: result.driver.number
            },
            constructor: {
              constructorId: result.constructor.id,
              name: result.constructor.name,
              nationality: result.constructor.nationality
            },
            points: result.points,
            status: result.status,
            time: result.time,
            fastestLap: result.fastestLap ? {
              time: result.fastestLap.time,
              lap: result.fastestLap.lap
            } : undefined
          }) )
        };
      }

      // 3. Get driver standings
      const driverStandingsData = await fetchData("/standings/drivers");
      if (driverStandingsData && Array.isArray(driverStandingsData)) {
        this.driverStandings = driverStandingsData.map((standing: any) => {
          this.emitter.emit("driverStanding", {
            driver: {
              driverId: standing.driver.id,
              code: standing.driver.code,
              firstName: standing.driver.firstName,
              lastName: standing.driver.lastName,
              nationality: standing.driver.nationality,
              permanentNumber: standing.driver.number
            },
            position: standing.position,
            points: standing.points,
            wins: standing.wins
          });
          return {
            driver: {
              driverId: standing.driver.id,
              code: standing.driver.code,
              firstName: standing.driver.firstName,
              lastName: standing.driver.lastName,
              nationality: standing.driver.nationality,
              permanentNumber: standing.driver.number
            },
            position: standing.position,
            points: standing.points,
            wins: standing.wins
          };
        });
      }

      // 4. Get constructor standings
      const constructorStandingsData = await fetchData("/standings/constructors");
      if (constructorStandingsData && Array.isArray(constructorStandingsData)) {
        this.constructorStandings = constructorStandingsData.map((standing: any) => {
          this.emitter.emit("constructorStanding", {
            constructor: {
              constructorId: standing.constructor.id,
              name: standing.constructor.name,
              nationality: standing.constructor.nationality
            },
            position: standing.position,
            points: standing.points,
            wins: standing.wins
          });
          return {
            constructor: {
              constructorId: standing.constructor.id,
              name: standing.constructor.name,
              nationality: standing.constructor.nationality
            },
            position: standing.position,
            points: standing.points,
            wins: standing.wins
          };
        });
      }

      // 5. Get qualifying results
      const qualifyingData = await fetchData("/races/last/qualifying");
      if (qualifyingData && qualifyingData.race && qualifyingData.results) {
        this.emitter.emit("qualifying", {
          season: qualifyingData.race.season,
          round: qualifyingData.race.round,
          raceName: qualifyingData.race.name,
          circuit: {
            circuitId: qualifyingData.race.circuit.id,
            name: qualifyingData.race.circuit.name,
            location: qualifyingData.race.circuit.location,
            country: qualifyingData.race.circuit.country,
            lat: parseFloat(qualifyingData.race.circuit.lat),
            lng: parseFloat(qualifyingData.race.circuit.lng)
          },
          results: qualifyingData.results.map((result: any) => ({
            position: result.position,
            driver: {
              driverId: result.driver.id,
              code: result.driver.code,
              firstName: result.driver.firstName,
              lastName: result.driver.lastName,
              nationality: result.driver.nationality,
              permanentNumber: result.driver.number
            },
            constructor: {
              constructorId: result.constructor.id,
              name: result.constructor.name,
              nationality: result.constructor.nationality
            },
            q1: result.q1,
            q2: result.q2,
            q3: result.q3
          }))
        });
        this.qualifyingResults = {
          results: qualifyingData.results.map((result: any) => ({
            position: result.position,
            driver: {
              driverId: result.driver.id,
              code: result.driver.code,
              firstName: result.driver.firstName,
              lastName: result.driver.lastName,
              nationality: result.driver.nationality,
              permanentNumber: result.driver.number
            },
            constructor: {
              constructorId: result.constructor.id,
              name: result.constructor.name,
              nationality: result.constructor.nationality
            },
            q1: result.q1,
            q2: result.q2,
            q3: result.q3
          }))
        };
      }
    } catch (error) {
      this.emitter.emit("error", error as Error);
    }
  }

  init(client: ForgeClient): void {
    this.client = client;
    this.commands = new F1CommandManager(client);

    EventManager.load(F1EventManagerName, __dirname + "/events");

    if (this.options.events?.length) {
      this.client.events.load(F1EventManagerName, this.options.events);
    }
  }

  load(path: string): void {
    // Load extension configuration from path if needed
  }

  cleanup(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}
// lmao fixed 