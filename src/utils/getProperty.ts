export function getProperty(obj: any, path: string): any {
  return path.split(".").reduce((prev, curr) => {
    if (prev && typeof prev === "object") {
      return prev[curr];
    }
    return undefined;
  }, obj);
}
