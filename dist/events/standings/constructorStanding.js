"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const F1EventHandlers_1 = require("../../structures/F1EventHandlers");
exports.default = new F1EventHandlers_1.F1EventHandler({
    name: "constructorStanding",
    description: "Triggered when constructor standings are updated",
    async listener(standing) {
        const { constructor, position, points, wins } = standing;
        console.log("F1 Constructor Championship Standing Update:");
        console.log(`Position: ${position}`);
        console.log(`Constructor: ${constructor.name}`);
        console.log(`Points: ${points}`);
        console.log(`Wins: ${wins}`);
    },
});
//# sourceMappingURL=constructorStanding.js.map