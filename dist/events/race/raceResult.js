"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const F1EventHandlers_1 = require("../../structures/F1EventHandlers");
exports.default = new F1EventHandlers_1.F1EventHandler({
    name: "raceResult",
    description: "Triggered when a race is completed and results are available",
    async listener(raceResult) {
        // Access race result data
        const { raceName, season, round, circuit, results } = raceResult;
        // Process and log race results
        const podium = results
            .filter(r => r.position <= 3)
            .map(r => ({
            position: r.position,
            driver: `${r.driver.firstName} ${r.driver.lastName}`,
            constructor: r.constructor.name,
            points: r.points
        }));
        // You can use this.client to interact with your bot/client
        // For example, sending messages or updating database
        console.log(`F1 Race Results: ${raceName} ${season}`);
        console.log(`Circuit: ${circuit.name}`);
        console.log("Podium:");
        podium.forEach(p => {
            console.log(`P${p.position}: ${p.driver} (${p.constructor}) - ${p.points} points`);
        });
    },
});
//# sourceMappingURL=raceResult.js.map