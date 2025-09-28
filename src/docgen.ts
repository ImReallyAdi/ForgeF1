
import { generateMetadata } from "@tryforge/forgescript";
import { F1EventManagerName } from "./constants";
import * as fs from "fs";
import * as path from "path";

function getEventFiles(eventsDir: string): string[] {
  const files: string[] = [];
  function walk(dir: string) {
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (
        file.endsWith(".ts") &&
        !file.startsWith("index") &&
        !file.endsWith(".d.ts") &&
        !file.endsWith(".map") &&
        !["standings.ts", "race.ts", "qualifying.ts", "raceResult.ts", "constructorStanding.ts", "driverStanding.ts"].includes(file)
      ) {
        files.push(fullPath);
      }
    }
  }
  walk(eventsDir);
  return files;
}

const eventFiles = getEventFiles(path.join(__dirname, "events"));

generateMetadata(
  path.join(__dirname, "functions"),
  "functions",
  F1EventManagerName,
  undefined,
  undefined,
  undefined,
  eventFiles
);
