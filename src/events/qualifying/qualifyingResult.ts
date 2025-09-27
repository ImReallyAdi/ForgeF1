import { F1EventHandler } from "../../structures/F1EventHandlers";
import { QualifyingEvent } from "../../types/f1";

export default new F1EventHandler<"qualifying">({
  name: "qualifying",
  description: "Triggered when qualifying session results are available",
  async listener(qualifyingResult: QualifyingEvent) {
    const { raceName, season, round, circuit, results } = qualifyingResult;
    
    // Process top 10 qualifiers
    const topTen = results
      .filter(r => r.position <= 10)
      .map(r => ({
        position: r.position,
        driver: `${r.driver.firstName} ${r.driver.lastName}`,
        constructor: r.constructor.name,
        q3: r.q3,
        q2: r.q2,
        q1: r.q1
      }));

    console.log(`F1 Qualifying Results: ${raceName} ${season}`);
    console.log(`Circuit: ${circuit.name}`);
    console.log("Top 10 Qualifiers:");
    topTen.forEach(p => {
      console.log(`P${p.position}: ${p.driver} (${p.constructor}) - Q3: ${p.q3 || 'N/A'}`);
    });
  },
});