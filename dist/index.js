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
            const api = axios.create({
                baseURL: "https://f1api.dev/api",
            });
            // Helper function to make API calls
            const fetchData = async (endpoint) => {
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
                    results: lastRaceData.results.map((result) => ({
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
                    results: lastRaceData.results.map((result) => ({
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
                };
            }
            // 3. Get driver standings
            const driverStandingsData = await fetchData("/standings/drivers");
            if (driverStandingsData && Array.isArray(driverStandingsData)) {
                this.driverStandings = driverStandingsData.map((standing) => {
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
                this.constructorStandings = constructorStandingsData.map((standing) => {
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
                    results: qualifyingData.results.map((result) => ({
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
                    results: qualifyingData.results.map((result) => ({
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