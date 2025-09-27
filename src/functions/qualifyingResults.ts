import { ArgType, NativeFunction } from "@tryforge/forgescript";

export default new NativeFunction({
    name: "$qualifyingResults",
    description: "Gets qualifying results from the last race weekend",
    unwrap: true,
    brackets: false,
    output: ArgType.Any,
    execute(ctx) {
        const ext = ctx.client.getExtension("forge.f1");
        if (!ext) return null;
        
        return ext.getQualifyingResults();
    }
});