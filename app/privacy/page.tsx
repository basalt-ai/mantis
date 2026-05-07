import type { Metadata } from "next";

import { HomeNav } from "@/components/sections/home/HomeNav";
import { Footer } from "@/components/shared/Footer";
import { H1 } from "@/components/ui/Headings";

export const metadata: Metadata = {
  title: "Privacy Policy — Pancake",
  description:
    "How Pancake (Basalt AI Inc.) collects, uses, and protects personal data across our website, web app, and Slack integration.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HomeNav />
      <section className="legal-section flex-1" aria-labelledby="privacy-heading">
        <div className="legal-section__inner">
          <H1 id="privacy-heading" className="legal-section__title">
            Privacy Policy
          </H1>

          <article className="legal-prose">
            <p>
              As part of its activities, Pancake may process personal data. We
              attach the utmost importance to the security and confidentiality
              of user data, whether collected via our website (
              <a href="https://getpancake.ai" target="_blank" rel="noopener noreferrer">
                https://getpancake.ai
              </a>
              ), web application (
              <a href="https://app.getpancake.ai" target="_blank" rel="noopener noreferrer">
                https://app.getpancake.ai
              </a>
              ), or third-party integrations such as Slack.
            </p>

            <h2>1. Data We Collect</h2>
            <p>We may collect and process the following categories of personal data:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> name, email address, company name
              </li>
              <li>
                <strong>Usage Data:</strong> interactions with the platform, feature usage, logs
              </li>
              <li>
                <strong>Technical Data:</strong> IP address, browser type, device information
              </li>
              <li>
                <strong>Slack Data (if applicable):</strong>
                <ul>
                  <li>User IDs</li>
                  <li>Workspace IDs</li>
                  <li>Channel IDs</li>
                  <li>Messages or content explicitly sent to the Pancake app</li>
                  <li>Metadata associated with Slack interactions (timestamps, event types)</li>
                </ul>
              </li>
            </ul>

            <h2>2. How We Use Data</h2>
            <p>We use collected data to:</p>
            <ul>
              <li>Provide and operate the Pancake service</li>
              <li>Authenticate users and manage accounts</li>
              <li>Improve product performance and features</li>
              <li>Ensure security and prevent abuse</li>
              <li>Respond to user requests and support inquiries</li>
            </ul>
            <p>
              <strong>Slack Data Usage:</strong>
            </p>
            <ul>
              <li>
                Slack data is only used to provide requested functionality within the Slack
                integration
              </li>
              <li>We do not use Slack data for advertising or unrelated purposes</li>
            </ul>

            <h2>3. Data We Do Not Use</h2>
            <p>
              In some cases, Pancake may receive data from Slack (such as event payloads or
              system logs) that is <strong>not actively used</strong>.
            </p>
            <ul>
              <li>
                This data is <strong>not processed beyond what is necessary for system operation</strong>
              </li>
              <li>
                It is <strong>not stored long-term</strong> and is automatically deleted
              </li>
            </ul>

            <h2>4. Data Retention</h2>
            <p>Personal data is retained only as long as necessary for the purposes described above:</p>
            <ul>
              <li>Account data: retained while the account is active</li>
              <li>
                Usage logs: retained for a limited period (e.g., up to 30 days) for security and
                debugging
              </li>
              <li>
                Slack data: retained only as needed to provide the service and may be deleted
                immediately after processing depending on the feature
              </li>
            </ul>
            <p>We may retain certain data longer if required by law.</p>

            <h2>5. Your Rights</h2>
            <p>In accordance with GDPR and applicable laws, you have the right to:</p>
            <ul>
              <li>Access your data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to processing</li>
              <li>Request data portability</li>
            </ul>
            <p>
              To exercise your rights, contact us at:{" "}
              <a href="mailto:privacy@pancake.ai">
                <strong>privacy@pancake.ai</strong>
              </a>
            </p>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect personal
              data from unauthorized access, loss, or disclosure.
            </p>
            <p>Data is hosted on GCP infrastructure located in the United States.</p>

            <h2>7. Contact</h2>
            <p>For any questions or requests regarding your data, you can contact us at:</p>
            <p>
              <a href="mailto:privacy@pancake.ai">
                <strong>privacy@pancake.ai</strong>
              </a>
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              This policy may be updated at any time. We encourage you to review it regularly.
              Significant changes will be communicated where appropriate.
            </p>
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
}
