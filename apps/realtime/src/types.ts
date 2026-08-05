export type SlotsChangedMessage = {
  type: "slots-changed";
  channel: string;
};

export type NotifyRequestBody = {
  channel: string;
};

export function isNotifyRequestBody(value: unknown): value is NotifyRequestBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const channel = (value as Record<string, unknown>).channel;
  return typeof channel === "string" && channel.length > 0;
}
