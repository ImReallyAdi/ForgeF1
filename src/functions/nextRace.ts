import { ArgType, NativeFunction } from "@tryforge/forgescript";

export default new NativeFunction({
    name: "$nextRace",
    description: "Gets information about the next F1 race",
    unwrap: true,
    brackets: false,
    output: ArgType.Any,
    execute(ctx) {
        const ext = ctx.client.getExtension("forge.f1");
        if (!ext) return null;
        
        return ext.getNextRace(); // returns an object with details.
    }
});