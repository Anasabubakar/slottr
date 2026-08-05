/**
 * Progressive-enhancement WebSocket connection to the @calcom/realtime service.
 *
 * When Google Calendar (or another provider) notifies Slottr of a change, the realtime
 * service broadcasts a `slots-changed` message to every embed subscribed to that
 * booking-page owner's username. This lets the embed refetch availability without the
 * visitor manually reloading the page.
 *
 * This must never block or break the embed: if the realtime service isn't configured or
 * isn't reachable, we simply don't get live updates and the embed keeps working exactly
 * as it did before (polling / load-time fetch only).
 */

const REALTIME_URL = process.env.EMBED_PUBLIC_REALTIME_URL || "";

type SlotsChangedMessage = {
  type: "slots-changed";
  channel: string;
};

function isSlotsChangedMessage(value: unknown): value is SlotsChangedMessage {
  if (typeof value !== "object" || value === null) return false;
  return (value as Record<string, unknown>).type === "slots-changed";
}

/**
 * Extracts the booking-page owner's username from a calLink like `jane` or `jane/intro-call`.
 * Returns null for calLink shapes we can't confidently map to a username (e.g. dynamic/team/router links).
 */
export function getUsernameFromCalLink(calLink: string): string | null {
  const [firstSegment] = calLink.replace(/^\/+/, "").split(/[/?]/);
  if (!firstSegment) return null;
  const RESERVED_FIRST_SEGMENTS = new Set(["team", "router", "forms", "d", "org"]);
  if (RESERVED_FIRST_SEGMENTS.has(firstSegment)) return null;
  return firstSegment;
}

/**
 * Opens (or reuses) a WebSocket subscription for the given channel and invokes `onSlotsChanged`
 * whenever the realtime service reports that channel's availability may have changed.
 *
 * Returns a cleanup function that closes the connection. Never throws.
 */
export function subscribeToRealtimeSlotChanges({
  channel,
  onSlotsChanged,
}: {
  channel: string;
  onSlotsChanged: () => void;
}): () => void {
  if (!REALTIME_URL) {
    return () => undefined;
  }

  let socket: WebSocket | null = null;

  try {
    const wsUrl = new URL(REALTIME_URL);
    wsUrl.protocol = wsUrl.protocol === "https:" ? "wss:" : "ws:";
    wsUrl.pathname = "/realtime";
    wsUrl.searchParams.set("channel", channel);

    socket = new WebSocket(wsUrl.toString());

    socket.addEventListener("message", (event: MessageEvent) => {
      try {
        const parsed: unknown = JSON.parse(event.data);
        if (isSlotsChangedMessage(parsed) && parsed.channel === channel) {
          onSlotsChanged();
        }
      } catch {
        // Ignore malformed messages - this channel is a best-effort enhancement.
      }
    });

    // Connection errors are expected when the realtime service isn't deployed/reachable.
    // Swallow them silently so the embed keeps working without live updates.
    socket.addEventListener("error", () => undefined);
  } catch {
    return () => undefined;
  }

  return () => {
    socket?.close();
  };
}
