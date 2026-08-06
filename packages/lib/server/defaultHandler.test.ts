import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { describe, it, expect, vi, afterEach } from "vitest";

import { defaultHandler } from "./defaultHandler";

describe("defaultHandler Test Suite", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return 405 for unsupported HTTP methods", async () => {
    const handlers = {};
    const handler = defaultHandler(handlers);

    const { req, res } = createMocks({
      method: "PATCH", // Unsupported method here
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({
      message: "Method Not Allowed (Allow: )",
    });
  });

  it("should call the correct handler for a supported method", async () => {
    const getHandler = vi.fn().mockResolvedValue(null);
    const handlers = {
      GET: Promise.resolve({ default: getHandler }),
    };
    const handler = defaultHandler(handlers);

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(getHandler).toHaveBeenCalledWith(req, res);
  });
});
