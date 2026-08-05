import { PrismaApiKeyRepository } from "@calcom/features/api-keys-legacy/api-keys/repositories/PrismaApiKeyRepository";
import { ApiKeyService } from "@calcom/features/api-keys-legacy/api-keys/services/ApiKeyService";
import { EmbedResolveService } from "@calcom/features/embed/services/EmbedResolveService";
import { EventTypeRepository } from "@calcom/features/eventtypes/repositories/eventTypeRepository";
import prisma from "@calcom/prisma";
import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This endpoint is called cross-origin from third-party sites embedding the booking widget via
// an API key, so it must allow any origin. It only ever returns data derived from a valid API key.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

function getApiKeyFromRequest(request: NextRequest): string | null {
  const queryApiKey = request.nextUrl.searchParams.get("apiKey");
  if (queryApiKey) {
    return queryApiKey;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  return null;
}

async function getHandler(request: NextRequest) {
  const apiKey = getApiKeyFromRequest(request);

  if (!apiKey) {
    return NextResponse.json({ message: "Missing API key" }, { status: 401, headers: CORS_HEADERS });
  }

  const apiKeyRepo = new PrismaApiKeyRepository(prisma);
  const apiKeyService = new ApiKeyService({ apiKeyRepo });
  const eventTypeRepo = new EventTypeRepository(prisma);
  const embedResolveService = new EmbedResolveService({ apiKeyService, apiKeyRepo, eventTypeRepo });

  const result = await embedResolveService.resolveByApiKey(apiKey);

  if (result.status === "invalid_key") {
    return NextResponse.json({ message: "Invalid API key" }, { status: 401, headers: CORS_HEADERS });
  }

  if (result.status === "no_bookable_event_type") {
    return NextResponse.json(
      { message: "No bookable event type found for this API key" },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(
    {
      username: result.username,
      eventTypeSlug: result.eventTypeSlug,
      calLink: result.calLink,
    },
    { headers: CORS_HEADERS }
  );
}

async function optionsHandler() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export const GET = defaultResponderForAppDir(getHandler);
export const OPTIONS = optionsHandler;
