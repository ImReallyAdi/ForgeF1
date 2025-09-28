import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeF1 } from "..";
import axios from "axios";

export default new NativeFunction({
  name: "$seasons",
  version: "1.0.3",
  description: "Gets all available F1 seasons",
  unwrap: true,
  brackets: false,
  args: [],
  output: ArgType.Json,
  async execute(ctx, args) {
    try {
      const response = await axios.get("https://f1api.dev/api/seasons");
      return this.success(response.data);
    } catch (err) {
      return this.success([]);
    }
  },
});
