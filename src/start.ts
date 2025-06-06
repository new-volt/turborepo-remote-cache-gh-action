import {
  saveState,
  info,
  setFailed,
  debug,
  exportVariable,
} from "@actions/core";
import { waitUntilUsed } from "tcp-port-used";
import { existsSync, mkdirSync } from "fs";
import { logDir } from "./constants";
import { host, teamId, token, storagePath, storageProvider } from "./inputs";
import { startApp } from "./server";

async function main() {
  if (!existsSync(logDir)) {
    debug(`Creating log directory: "${logDir}"...`);
    mkdirSync(logDir, { recursive: true });
  }

  const port = 8585;

  debug(`Export environment variables...`);
  exportVariable("TURBO_API", `${host}:${port}`);
  exportVariable("TURBO_TOKEN", token);
  exportVariable("TURBO_TEAM", teamId);
  exportVariable("STORAGE_PROVIDER", storageProvider);
  exportVariable("STORAGE_PATH", storagePath);

  debug(`Starting Turbo Cache Server...`);

  startApp();

  try {
    debug(`Waiting for port ${port} to be used...`);
    await waitUntilUsed(port, 250, 30000);

    info("Spawned Turbo Cache Server:");
    // info(`  PID: ${pid}`);
    info(`  Listening on port: ${port}`);
    // saveState("pid", subprocess.pid?.toString());
  } catch (e) {
    console.log(e);
    throw new Error(`Turbo server failed to start on port: ${port}`);
  }
}

main().catch(setFailed);
