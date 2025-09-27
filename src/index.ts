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
      const ergastApi = axios.create({
        baseURL: "http://ergast.com/api/f1",
        params: {
          limit: 1000
        }
      });

      // Helper function to make API calls
      const fetchData = async (endpoint: string) => {
        const response = await ergastApi.get(`${endpoint}.json`);
        return response.data;
      };
      
      // 1. Get current race schedule
      const schedule = await fetchData(`/${currentSeason}`);
      const races = schedule.MRData.RaceTable.Races;
      const nextRace = races.find((race: any) => {
        const raceDate = new Date(`${race.date}T${race.time || "00:00:00Z"}`);
        return raceDate > currentDate;
      });

      if (nextRace) {
        this.emitter.emit("raceWeekend", {
          circuit: {
            circuitId: nextRace.Circuit.circuitId,
            name: nextRace.Circuit.circuitName,
            location: nextRace.Circuit.Location.locality,
            country: nextRace.Circuit.Location.country,
            lat: parseFloat(nextRace.Circuit.Location.lat),
            lng: parseFloat(nextRace.Circuit.Location.long)
          },
          schedule: {
            fp1: nextRace.FirstPractice?.date || "",
            fp2: nextRace.SecondPractice?.date || "",
            fp3: nextRace.ThirdPractice?.date || "",
            qualifying: nextRace.Qualifying?.date || "",
            sprint: nextRace.Sprint?.date,
            race: nextRace.date
          }
        });
      }

      // 2. Get latest race results
      const lastRoundIndex = races.findIndex((race: any) => {
        const raceDate = new Date(`${race.date}T${race.time || "00:00:00Z"}`);
        return raceDate < currentDate;
      }) - 1;
      
      if (lastRoundIndex >= 0) {
        const lastRound = races[lastRoundIndex].round;
        const raceResults = await fetchData(`/${currentSeason}/${lastRound}/results`);
        const lastRace = raceResults.MRData.RaceTable.Races[0];

        if (lastRace) {
          this.emitter.emit("raceResult", {
            season: currentSeason,
            round: parseInt(lastRace.round),
            raceName: lastRace.raceName,
            circuit: {
              circuitId: lastRace.Circuit.circuitId,
              name: lastRace.Circuit.circuitName,
              location: lastRace.Circuit.Location.locality,
              country: lastRace.Circuit.Location.country,
              lat: parseFloat(lastRace.Circuit.Location.lat),
              lng: parseFloat(lastRace.Circuit.Location.long)
            },
            results: lastRace.Results.map((result: any) => ({
              position: parseInt(result.position),
              driver: {
                driverId: result.Driver.driverId,
                code: result.Driver.code,
                firstName: result.Driver.givenName,
                lastName: result.Driver.familyName,
                nationality: result.Driver.nationality,
                permanentNumber: result.Driver.permanentNumber
              },
              constructor: {
                constructorId: result.Constructor.constructorId,
                name: result.Constructor.name,
                nationality: result.Constructor.nationality
              },
              points: parseFloat(result.points),
              status: result.status,
              time: result.Time?.time,
              fastestLap: result.FastestLap ? {
                time: result.FastestLap.Time.time,
                lap: parseInt(result.FastestLap.lap)
              } : undefined
            }))
          });

          // 3. Get driver standings
          const driverStandingsData = await fetchData(`/${currentSeason}/driverStandings`);
          const driverStandings = driverStandingsData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
          
          driverStandings.forEach((standing: any) => {
            this.emitter.emit("driverStanding", {
              driver: {
                driverId: standing.Driver.driverId,
                code: standing.Driver.code,
                firstName: standing.Driver.givenName,
                lastName: standing.Driver.familyName,
                nationality: standing.Driver.nationality,
                permanentNumber: standing.Driver.permanentNumber
              },
              position: parseInt(standing.position),
              points: parseFloat(standing.points),
              wins: parseInt(standing.wins)
            });
          });

          // 4. Get constructor standings
          const constructorStandingsData = await fetchData(`/${currentSeason}/constructorStandings`);
          const constructorStandings = constructorStandingsData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
          
          constructorStandings.forEach((standing: any) => {
            this.emitter.emit("constructorStanding", {
              constructor: {
                constructorId: standing.Constructor.constructorId,
                name: standing.Constructor.name,
                nationality: standing.Constructor.nationality
              },
              position: parseInt(standing.position),
              points: parseFloat(standing.points),
              wins: parseInt(standing.wins)
            });
          });

          // 5. Get qualifying results
          const qualifyingData = await fetchData(`/${currentSeason}/${lastRound}/qualifying`);
          const qualifyingRace = qualifyingData.MRData.RaceTable.Races[0];
          
          if (qualifyingRace) {
            this.emitter.emit("qualifying", {
              season: currentSeason,
              round: parseInt(qualifyingRace.round),
              raceName: qualifyingRace.raceName,
              circuit: {
                circuitId: qualifyingRace.Circuit.circuitId,
                name: qualifyingRace.Circuit.circuitName,
                location: qualifyingRace.Circuit.Location.locality,
                country: qualifyingRace.Circuit.Location.country,
                lat: parseFloat(qualifyingRace.Circuit.Location.lat),
                lng: parseFloat(qualifyingRace.Circuit.Location.long)
              },
              results: qualifyingRace.QualifyingResults.map((result: any) => ({
                position: parseInt(result.position),
                driver: {
                  driverId: result.Driver.driverId,
                  code: result.Driver.code,
                  firstName: result.Driver.givenName,
                  lastName: result.Driver.familyName,
                  nationality: result.Driver.nationality,
                  permanentNumber: result.Driver.permanentNumber
                },
                constructor: {
                  constructorId: result.Constructor.constructorId,
                  name: result.Constructor.name,
                  nationality: result.Constructor.nationality
                },
                q1: result.Q1 || undefined,
                q2: result.Q2 || undefined,
                q3: result.Q3 || undefined
              }))
            });
          }
        }
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
