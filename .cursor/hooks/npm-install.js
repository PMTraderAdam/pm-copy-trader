import { execSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const lockfile = join(projectRoot, "package-lock.json");
const nodeModules = join(projectRoot, "node_modules");

function dependenciesUpToDate() {
  if (!existsSync(nodeModules) || !existsSync(lockfile)) {
    return false;
  }

  return statSync(nodeModules).mtimeMs >= statSync(lockfile).mtimeMs;
}

if (!dependenciesUpToDate()) {
  try {
    execSync("npm i", { cwd: projectRoot, stdio: "inherit" });
  } catch {
    process.exitCode = 1;
  }
}

console.log("{}");
