import { generateMetadata } from "@tryforge/forgescript";
import { GithubEventManagerName } from "./constants";

generateMetadata(
  __dirname + "/functions",
  "functions",
  GithubEventManagerName,
  undefined,
  undefined,
  __dirname + "/events",
);
