/** @format */

import { setup as setupDevServer } from "jest-dev-server";

export default async function globalSetup() {
  await setupDevServer({
    command: `kill-port 3000 && serverless offline --httpPort=3000`,
    launchTimeout: 50000,
    port: 3000,
  });
}
