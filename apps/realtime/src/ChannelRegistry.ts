import type { WebSocket } from "ws";
import type { SlotsChangedMessage } from "./types";

/**
 * Tracks which WebSocket clients are subscribed to which channel (booking-page owner's username)
 * so a single calendar change notification can be broadcast to every embed watching that page.
 */
export class ChannelRegistry {
  private channels = new Map<string, Set<WebSocket>>();

  subscribe(channel: string, socket: WebSocket): void {
    let sockets = this.channels.get(channel);
    if (!sockets) {
      sockets = new Set();
      this.channels.set(channel, sockets);
    }
    sockets.add(socket);
  }

  unsubscribe(channel: string, socket: WebSocket): void {
    const sockets = this.channels.get(channel);
    if (!sockets) return;
    sockets.delete(socket);
    if (sockets.size === 0) {
      this.channels.delete(channel);
    }
  }

  broadcast(channel: string): number {
    const sockets = this.channels.get(channel);
    if (!sockets || sockets.size === 0) {
      return 0;
    }
    const message: SlotsChangedMessage = { type: "slots-changed", channel };
    const payload = JSON.stringify(message);
    let sent = 0;
    for (const socket of sockets) {
      if (socket.readyState === socket.OPEN) {
        socket.send(payload);
        sent += 1;
      }
    }
    return sent;
  }

  get channelCount(): number {
    return this.channels.size;
  }
}
