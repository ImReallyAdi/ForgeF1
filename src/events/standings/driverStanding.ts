import { F1EventHandler } from "../../structures/F1EventHandlers";
import { DriverStandingEvent } from "../../types/f1";

export default new F1EventHandler<"driverStanding">({
  name: "driverStanding",
  description: "Triggered when driver standings are updated",
  async listener(standing: DriverStandingEvent) {
    const { driver, position, points, wins } = standing;
    
    console.log("F1 Driver Championship Standing Update:");
    console.log(`Position: ${position}`);
    console.log(`Driver: ${driver.firstName} ${driver.lastName}`);
    console.log(`Points: ${points}`);
    console.log(`Wins: ${wins}`);
  },
});