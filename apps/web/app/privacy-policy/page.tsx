import { APP_NAME, SUPPORT_MAIL_ADDRESS, WEBAPP_URL } from "@calcom/lib/constants";

export const metadata = {
  title: `Privacy Policy | ${APP_NAME}`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-sm leading-6">
      <h1 className="mb-6 text-2xl font-semibold">Privacy Policy</h1>
      <p className="mb-4 text-subtle">Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <p className="mb-4">
        {APP_NAME} ({WEBAPP_URL}) is a self-hosted scheduling application. This page explains what
        data is collected when you use it and how it is handled.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Data we collect</h2>
      <ul className="mb-4 list-disc space-y-1 pl-5">
        <li>Account information you provide: name, email address, username, and password (stored hashed).</li>
        <li>
          Calendar data you choose to connect (e.g. Google Calendar), used only to check availability and
          create booked events on your behalf.
        </li>
        <li>Booking details entered by you or by people booking time with you (name, email, notes).</li>
        <li>Basic technical logs (request metadata) needed to operate and secure the service.</li>
      </ul>

      <h2 className="mb-2 mt-8 text-lg font-semibold">How we use data</h2>
      <p className="mb-4">
        Data is used solely to provide scheduling functionality: authenticating you, checking calendar
        availability, creating calendar events, and sending booking-related emails (confirmations,
        reminders, and verification codes).
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Third-party services</h2>
      <ul className="mb-4 list-disc space-y-1 pl-5">
        <li>Google Calendar API — to read availability and create events on connected calendars.</li>
        <li>An email delivery provider — to send transactional emails (confirmations, verification, reminders).</li>
      </ul>
      <p className="mb-4">No data is sold or shared with advertisers.</p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Data retention</h2>
      <p className="mb-4">
        Account and booking data is retained for as long as your account is active. You may request
        deletion of your account and associated data at any time.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Contact</h2>
      <p className="mb-4">
        Questions about this policy or your data can be sent to{" "}
        <a className="underline" href={`mailto:${SUPPORT_MAIL_ADDRESS}`}>
          {SUPPORT_MAIL_ADDRESS}
        </a>
        .
      </p>
    </div>
  );
}
