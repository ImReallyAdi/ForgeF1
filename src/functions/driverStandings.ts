import { ArgType, NativeFunction } from "@tryforge/forgescript";

export default new NativeFunction({
    name: "$driverStandings",
    description: "Gets current F1 driver standings",
    unwrap: true,
    brackets: false,
    output: ArgType.Any,
    execute(ctx) {
        const ext = ctx.client.getExtension("forge.f1");
        if (!ext) return null;
        
        return ext.getDriverStandings();
    }
});