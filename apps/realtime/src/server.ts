import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";

import { WebSocketServer } from "ws";

import { ChannelRegistry } from "./ChannelRegistry";
import { isNotifyRequestBody } from "./types";

const PORT = Number(process.env.REALTIME_SYNC_PORT ?? 4000);

const registry = new ChannelRegistry();

function getChannelFromRequestUrl(url: string | undefined): string | null {
  if (!url) return null;
  const parsed = new URL(url, "http://localhost");
  const channel = parsed.searchParams.get("channel");
  return channel && channel.length > 0 ? channel : null;
}

function readRequestBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    request.on("data", (chunk: Buffer) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    request.on("error", reject);
  });
}

async function handleNotify(request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    const rawBody = await readRequestBody(request);
    const parsedBody: unknown = rawBody ? JSON.parse(rawBody) : null;

    if (!isNotifyRequestBody(parsedBody)) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "Expected { channel: string }" }));
      return;
    }

    const clientsNotified = registry.broadcast(parsedBody.channel);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "Notified", clientsNotified }));
  } catch (error) {
    response.writeHead(400, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: error instanceof Error ? error.message : "Invalid request" }));
  }
}

const httpServer = createServer((request, response) => {
  if (request.method === "POST" && request.url?.startsWith("/internal/notify")) {
    void handleNotify(request, response);
    return;
  }

  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "ok", channels: registry.channelCount }));
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ message: "Not found" }));
});

const wss = new WebSocketServer({ server: httpServer, path: "/realtime" });

wss.on("connection", (socket, request) => {
  const channel = getChannelFromRequestUrl(request.url);
  if (!channel) {
    socket.close(1008, "Missing channel query param");
    return;
  }

  registry.subscribe(channel, socket);

  socket.on("close", () => {
    registry.unsubscribe(channel, socket);
  });

  socket.on("error", () => {
    registry.unsubscribe(channel, socket);
  });
});

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[realtime] listening on port ${PORT}`);
});
