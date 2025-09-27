export interface Circuit {
  circuitId: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Driver {
  driverId: string;
  permanentNumber: string;
  code: string;
  firstName: string;
  lastName: string;
  nationality: string;
}

export interface Constructor {
  constructorId: string;
  name: string;
  nationality: string;
}

export interface RaceWeekendEvent {
  circuit: Circuit;
  schedule: {
    fp1: string;
    fp2: string;
    fp3?: string;
    sprint?: string;
    qualifying: string;
    race: string;
  };
}

export interface RaceResultEvent {
  season: number;
  round: number;
  raceName: string;
  circuit: Circuit;
  results: Array<{
    position: number;
    driver: Driver;
    constructor: Constructor;
    points: number;
    status: string;
    time?: string;
    fastestLap?: {
      time: string;
      lap: number;
    };
  }>;
}

export interface DriverStandingEvent {
  driver: Driver;
  position: number;
  points: number;
  wins: number;
}

export interface ConstructorStandingEvent {
  constructor: Constructor;
  position: number;
  points: number;
  wins: number;
}

export interface QualifyingEvent {
  season: number;
  round: number;
  raceName: string;
  circuit: Circuit;
  results: Array<{
    driver: Driver;
    constructor: Constructor;
    position: number;
    q1?: string;
    q2?: string;
    q3?: string;
  }>;
}