import { ArgType, NativeFunction } from "@tryforge/forgescript";

export default new NativeFunction({
    name: "$constructorStandings",
    description: "Gets current F1 constructor standings",
    unwrap: true,
    brackets: false,
    output: ArgType.Any,
    execute(ctx) {
        const ext = ctx.client.getExtension("forge.f1");
        if (!ext) return null;
        
        return ext.getConstructorStandings();
    }
});