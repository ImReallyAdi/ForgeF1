"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeF1 = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const F1CommandManager_1 = require("./structures/F1CommandManager");
const constants_1 = require("./constants");
class ForgeF1 extends forgescript_1.ForgeExtension {
    options;
    name = "forge.f1";
    description = "An extension that provides Formula 1 racing data and events.";
    version = require("../package.json").version;
    updateInterval = null;
    latestEventType = null;
    emitter = new tiny_typed_emitter_1.TypedEmitter();
    commands;
    client;
    lastRace = null;
    nextRace = null;
    driverStandings = [];
    constructorStandings = [];
    qualifyingResults = null;
    constructor(options) {
        super();
        this.options = options;
        this.startPolling(options.updateInterval ?? 60000);
    }
    getNextRace() {
        return this.nextRace;
    }
    getLastRaceResults() {
        return this.lastRace?.results ?? [];
    }
    getDriverStandings() {
        return this.driverStandings;
    }
    getConstructorStandings() {
        return this.constructorStandings;
    }
    getQualifyingResults() {
        return this.qualifyingResults?.results ?? [];
    }
    async startPolling(interval) {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        await this.updateF1Data();
        this.updateInterval = setInterval(() => this.updateF1Data(), interval);
    }
    async updateF1Data() {
        try {
            const { default: axios } = await Promise.resolve().then(() => __importStar(require("axios")));
            const currentDate = new Date();
            const currentSeason = currentDate.getFullYear();
            const ergastApi = axios.create({
                baseURL: "http://ergast.com/api/f1",
                params: {
                    limit: 1000
                }
            });
            // Helper function to make API calls
            const fetchData = async (endpoint) => {
                const response = await ergastApi.get(`${endpoint}.json`);
                return response.data;
            };
            // 1. Get current race schedule
            const schedule = await fetchData(`/${currentSeason}`);
            const races = schedule.MRData.RaceTable.Races;
            const nextRace = races.find((race) => {
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
            const lastRoundIndex = races.findIndex((race) => {
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
                        results: lastRace.Results.map((result) => ({
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
                    driverStandings.forEach((standing) => {
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
                    constructorStandings.forEach((standing) => {
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
                            results: qualifyingRace.QualifyingResults.map((result) => ({
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
        }
        catch (error) {
            this.emitter.emit("error", error);
        }
    }
    init(client) {
        this.client = client;
        this.commands = new F1CommandManager_1.F1CommandManager(client);
        forgescript_1.EventManager.load(constants_1.F1EventManagerName, __dirname + "/events");
        if (this.options.events?.length) {
            this.client.events.load(constants_1.F1EventManagerName, this.options.events);
        }
    }
    load(path) {
        // Load extension configuration from path if needed
    }
    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}
exports.ForgeF1 = ForgeF1;
// lmao fixed 
//# sourceMappingURL=index.js.map