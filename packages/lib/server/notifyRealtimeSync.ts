import process from "node:process";
import logger from "../logger";

const log = logger.getSubLogger({ prefix: ["notifyRealtimeSync"] });

const REALTIME_SYNC_URL = process.env.REALTIME_SYNC_URL || "http://localhost:4000";

/**
 * Fire-and-forget notification to the @calcom/realtime service so embed widgets
 * subscribed to this username's channel can refetch availability.
 *
 * Never throws: a down or misconfigured realtime service must not affect calendar sync.
 */
export function notifyRealtimeSync(channel: string): void {
  if (!channel) return;

  fetch(`${REALTIME_SYNC_URL}/internal/notify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel }),
  }).catch((error: unknown) => {
    log.warn("Failed to notify realtime sync service", {
      channel,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  });
}
