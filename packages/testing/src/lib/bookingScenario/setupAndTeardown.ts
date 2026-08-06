import { enableEmailFeature, mockNoTranslations } from "./bookingScenario";
import { afterEach, beforeEach, vi } from "vitest";

export function setupAndTeardown() {
  beforeEach(() => {
    // Required to able to generate token in email in some cases
    vi.stubEnv("CALENDSO_ENCRYPTION_KEY", "abcdefghjnmkljhjklmnhjklkmnbhjui");
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "MOCK_STRIPE_WEBHOOK_SECRET");
    // We are setting it in vitest.config.ts because otherwise it's too late to set it.
    // process.env.DAILY_API_KEY = "MOCK_DAILY_API_KEY";

    // Ensure that Rate Limiting isn't enforced for tests
    vi.stubEnv("UNKEY_ROOT_KEY", undefined);
    mockNoTranslations();
    // mockEnableEmailFeature();
    enableEmailFeature();
    globalThis.testEmails = [];
    fetchMock.resetMocks();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    globalThis.testEmails = [];
    fetchMock.resetMocks();
    // process.env.DAILY_API_KEY = "MOCK_DAILY_API_KEY";
  });
}
