import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics: records the Tripwise Assistant's turns. Runs once, before the server starts.
pendo.init({
  apiKey: "80961e6a-13f8-4dcf-929a-501b6e3d8dbf",
  agentId: "I6wCjIitsGm63U3-CbRWPBQN4SU",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

/** Stops the server and sends Pendo's buffered events before the process exits. */
async function stop(): Promise<void> {
  server.close();
  await pendo.shutdown();
  process.exit(0);
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());
