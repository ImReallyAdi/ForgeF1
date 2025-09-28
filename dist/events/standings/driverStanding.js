"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const F1EventHandlers_1 = require("../../structures/F1EventHandlers");
exports.default = new F1EventHandlers_1.F1EventHandler({
    name: "driverStanding",
    description: "Triggered when driver standings are updated",
    async listener(standing) {
        const { driver, position, points, wins } = standing;
        console.log("F1 Driver Championship Standing Update:");
        console.log(`Position: ${position}`);
        console.log(`Driver: ${driver.firstName} ${driver.lastName}`);
        console.log(`Points: ${points}`);
        console.log(`Wins: ${wins}`);
    },
});
//# sourceMappingURL=driverStanding.js.map