import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { ForgeF1 } from "..";
import axios from "axios";

export default new NativeFunction({
  name: "$drivers",
  version: "1.0.3",
  description: "Gets all F1 drivers for the current season",
  unwrap: true,
  brackets: false,
  args: [],
  output: ArgType.Json,
  async execute(ctx, args) {
    try {
      const response = await axios.get("https://f1api.dev/api/drivers");
      return this.success(response.data);
    } catch (err) {
      return this.success([]);
    }
  },
});
