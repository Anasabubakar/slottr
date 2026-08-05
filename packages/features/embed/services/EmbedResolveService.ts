import process from "node:process";
import { hashAPIKey } from "@calcom/features/api-keys-legacy/api-keys/lib/apiKeys";
import type { PrismaApiKeyRepository } from "@calcom/features/api-keys-legacy/api-keys/repositories/PrismaApiKeyRepository";
import type { ApiKeyService } from "@calcom/features/api-keys-legacy/api-keys/services/ApiKeyService";
import type { EventTypeRepository } from "@calcom/features/eventtypes/repositories/eventTypeRepository";

type Deps = {
  apiKeyService: ApiKeyService;
  apiKeyRepo: PrismaApiKeyRepository;
  eventTypeRepo: EventTypeRepository;
};

export type EmbedResolveResult =
  | { status: "success"; username: string; eventTypeSlug: string; calLink: string }
  | { status: "invalid_key" }
  | { status: "no_bookable_event_type" };

/**
 * Resolves a public API key (as pasted into a booking widget on a third-party site) to the
 * `calLink` needed to mount the embed, without ever exposing the user's Slottr username or
 * event-type slug to the caller ahead of a successful key check.
 */
export class EmbedResolveService {
  constructor(private readonly deps: Deps) {}

  async resolveByApiKey(rawApiKey: string): Promise<EmbedResolveResult> {
    const apiKeyPrefix = process.env.API_KEY_PREFIX ?? "cal_";
    const apiKeyWithoutPrefix = rawApiKey.startsWith(apiKeyPrefix)
      ? rawApiKey.slice(apiKeyPrefix.length)
      : rawApiKey;

    const hashedKey = hashAPIKey(apiKeyWithoutPrefix);
    const verifyResult = await this.deps.apiKeyService.verifyKeyByHashedKey(hashedKey);

    if (!verifyResult.valid) {
      return { status: "invalid_key" };
    }

    if (verifyResult.user.locked) {
      return { status: "invalid_key" };
    }

    const eventType = await this.deps.eventTypeRepo.findFirstBookableByUserId({
      userId: verifyResult.userId,
    });

    if (!eventType) {
      return { status: "no_bookable_event_type" };
    }

    const username = await this.getUsername(verifyResult.userId);
    if (!username) {
      return { status: "no_bookable_event_type" };
    }

    return {
      status: "success",
      username,
      eventTypeSlug: eventType.slug,
      calLink: `${username}/${eventType.slug}`,
    };
  }

  private async getUsername(userId: number): Promise<string | null> {
    const user = await this.deps.apiKeyRepo.findApiKeyUsername({ userId });
    return user?.username ?? null;
  }
}
