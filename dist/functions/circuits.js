"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const axios_1 = __importDefault(require("axios"));
exports.default = new forgescript_1.NativeFunction({
    name: "$circuits",
    version: "1.0.3",
    description: "Gets all F1 circuits for the current season",
    unwrap: true,
    brackets: false,
    args: [],
    output: forgescript_1.ArgType.Json,
    async execute(ctx, args) {
        try {
            const response = await axios_1.default.get("https://f1api.dev/api/circuits");
            return this.success(response.data);
        }
        catch (err) {
            return this.success([]);
        }
    },
});
//# sourceMappingURL=circuits.js.map