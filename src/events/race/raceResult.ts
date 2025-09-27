import { F1EventHandler } from "../../structures/F1EventHandlers";
import { RaceResultEvent } from "../../types/f1";

export default new F1EventHandler<"raceResult">({
  name: "raceResult",
  description: "Triggered when a race is completed and results are available",
  async listener(raceResult: RaceResultEvent) {
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