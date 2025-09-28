import { F1EventHandler } from "../../structures/F1EventHandlers";
import { ConstructorStandingEvent } from "../../types/f1";

export default new F1EventHandler<"constructorStanding">({
  name: "constructorStanding",
  description: "Triggered when constructor standings are updated",
  async listener(standing: ConstructorStandingEvent) {
    const { constructor, position, points, wins } = standing;

    console.log("F1 Constructor Championship Standing Update:");
    console.log(`Position: ${position}`);
    console.log(`Constructor: ${constructor.name}`);
    console.log(`Points: ${points}`);
    console.log(`Wins: ${wins}`);
  },
});
