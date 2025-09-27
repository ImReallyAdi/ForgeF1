import { generateMetadata } from "@tryforge/forgescript";
import { F1EventManagerName } from "./constants";

generateMetadata(
  __dirname + "/functions",
  "functions",
  F1EventManagerName,
  undefined,
  undefined,
  __dirname + "/events",
);
