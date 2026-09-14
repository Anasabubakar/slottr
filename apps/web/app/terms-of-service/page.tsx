import { APP_NAME, SUPPORT_MAIL_ADDRESS, WEBAPP_URL } from "@calcom/lib/constants";

export const metadata = {
  title: `Terms of Service | ${APP_NAME}`,
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-sm leading-6">
      <h1 className="mb-6 text-2xl font-semibold">Terms of Service</h1>
      <p className="mb-4 text-subtle">Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <p className="mb-4">
        These terms govern use of {APP_NAME} ({WEBAPP_URL}). By creating an account or booking a meeting
        through this service, you agree to these terms.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Use of the service</h2>
      <p className="mb-4">
        {APP_NAME} is scheduling software. You are responsible for the accuracy of the availability and
        event details you configure, and for the conduct of meetings you schedule through it.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Accounts</h2>
      <p className="mb-4">
        You are responsible for maintaining the security of your account credentials and for all
        activity that occurs under your account.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Acceptable use</h2>
      <p className="mb-4">
        You may not use this service to send spam, harass others, or engage in unlawful activity. Accounts
        found doing so may be suspended or terminated.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Availability</h2>
      <p className="mb-4">
        This service is provided on an as-is basis without uptime guarantees. Scheduled maintenance or
        outages may occur without notice.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Changes</h2>
      <p className="mb-4">
        These terms may be updated from time to time. Continued use of the service after changes
        constitutes acceptance of the updated terms.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Contact</h2>
      <p className="mb-4">
        Questions about these terms can be sent to{" "}
        <a className="underline" href={`mailto:${SUPPORT_MAIL_ADDRESS}`}>
          {SUPPORT_MAIL_ADDRESS}
        </a>
        .
      </p>
    </div>
  );
}
