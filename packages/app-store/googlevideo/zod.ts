import { z } from "zod";

export const appDataSchema = z.object({});

// Google Meet reuses the Google Calendar OAuth credential (see dependencies:
// ["google-calendar"] in _metadata.ts) rather than needing its own client
// id/secret, so this app has no keys of its own to configure.
export const appKeysSchema = z.object({});
