# ForgeScript F1 Events

This extension provides Formula 1 racing data and events for ForgeScript.

## Features

* Race weekend schedules
* Race results
* Qualifying results
* Driver standings
* Constructor standings

## Installation

```bash
npm install @
```

## Usage

```typescript
const { ForgeF1 } = require("@");

// Initialize the F1 extension
client.loadEtryforge/forge.f1xtension(
  new ForgeF1({
    updateInterval: 60000, // Update every minute
    events: ["raceWeekend", "raceResult", "qualifying", "driverStanding", "constructorStanding"]
  })
);
```

## Events

### Race Weekend
Triggered when a race weekend is approaching or ongoing. Includes:
- Circuit information
- Schedule for practice sessions, qualifying, and race
- Sprint race schedule (if applicable)

### Race Results
Triggered after a race is completed. Includes:
- Full race results
- Driver positions
- Points scored
- Fastest laps
- DNF information

### Qualifying Results
Triggered after qualifying sessions. Includes:
- Q1, Q2, and Q3 times
- Final grid positions
- Constructor information

### Driver Standings
Triggered when driver standings are updated. Includes:
- Current position
- Points
- Number of wins
- Driver details

### Constructor Standings
Triggered when constructor standings are updated. Includes:
- Current position
- Points
- Number of wins
- Constructor details

## Data Source
This extension uses the [Ergast Motor Racing Developer API](http://ergast.com/mrd/) to fetch Formula 1 data. The API is free to use and does not require authentication.

# Still in progess btw!

## made w/ love adi