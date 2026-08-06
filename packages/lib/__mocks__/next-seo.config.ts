import { vi } from "vitest";

vi.mock("@calcom/lib/next-seo.config", () => ({
  default: {
    headSeo: {
      siteName: "Slottr",
    },
    defaultNextSeo: {
      title: "Slottr",
      description: "Scheduling infrastructure for everyone.",
    },
  },
  seoConfig: {
    headSeo: {
      siteName: "Slottr",
    },
  },
  buildSeoMeta: vi.fn().mockReturnValue({}),
}));
