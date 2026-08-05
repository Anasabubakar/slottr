/**
 * Resolves an embed `apiKey` to the `calLink` needed to mount the booking widget, by calling the
 * public `/api/embed/resolve` endpoint. This lets a third-party site configure the embed with
 * just an API key instead of the user's Slottr username and event-type slug.
 */
export async function resolveApiKeyToCalLink({
  apiKey,
  calOrigin,
}: {
  apiKey: string;
  calOrigin: string;
}): Promise<string> {
  const resolveUrl = new URL("/api/embed/resolve", calOrigin);
  resolveUrl.searchParams.set("apiKey", apiKey);

  const response = await fetch(resolveUrl.toString());

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Cal Embed: The provided apiKey is invalid or expired");
    }
    if (response.status === 404) {
      throw new Error("Cal Embed: No bookable event type found for the provided apiKey");
    }
    throw new Error(`Cal Embed: Failed to resolve apiKey (status ${response.status})`);
  }

  const data = (await response.json()) as { calLink?: string };

  if (!data.calLink) {
    throw new Error("Cal Embed: apiKey resolution response is missing calLink");
  }

  return data.calLink;
}
