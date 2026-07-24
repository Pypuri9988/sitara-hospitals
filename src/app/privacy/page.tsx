import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects your personal and health information.`,
};

const lastUpdated = "24 July 2026";

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-slate-500">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-slate-700">
        <p>
          {siteConfig.name} ({siteConfig.hospitalName}, {siteConfig.location})
          (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy.
          This policy explains what information we collect through our website
          and WhatsApp service, how we use it, and the choices you have.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">1. Information we collect</h2>
          <p className="mt-3">
            When you contact us, book a consultation, register as a patient, or
            message us on WhatsApp, we may collect:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Your name, phone number, age and gender.</li>
            <li>Your city/town and the health concern or reason for contacting us.</li>
            <li>Appointment preferences (date, time and consultation type).</li>
            <li>Messages you send us via the website assistant or WhatsApp.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">2. How we use your information</h2>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>To schedule, confirm and manage your appointments.</li>
            <li>To contact you (by call or WhatsApp) about your enquiry or booking.</li>
            <li>To provide medical care and maintain your patient records.</li>
            <li>To improve our services and respond to your questions.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">3. WhatsApp messaging</h2>
          <p className="mt-3">
            We use the WhatsApp Business Platform (provided by Meta) to
            communicate with you. Messages you send to our WhatsApp number are
            processed to respond to your requests. Your use of WhatsApp is also
            subject to WhatsApp&apos;s own privacy policy. We only message you in
            connection with your enquiries, appointments and care.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">4. How we protect and store data</h2>
          <p className="mt-3">
            Your information is stored securely and access is limited to
            authorised staff involved in your care. We retain your details only
            as long as necessary for medical, legal and administrative purposes.
            We do <strong>not</strong> sell your personal or health information.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">5. Sharing</h2>
          <p className="mt-3">
            We do not share your information with third parties for marketing.
            We may share it only where required to provide your care, or where
            required by law.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">6. Your choices and data deletion</h2>
          <p className="mt-3">
            You may request access to, correction of, or deletion of your
            personal information at any time by contacting us. To stop receiving
            WhatsApp messages, reply <strong>STOP</strong> or ask us to remove
            your number.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">7. Contact us</h2>
          <p className="mt-3">
            For any privacy questions or requests, contact:
          </p>
          <ul className="mt-3 space-y-1">
            <li><strong>{siteConfig.hospitalName}</strong></li>
            <li>{siteConfig.address}</li>
            <li>Phone: {siteConfig.phone}</li>
            <li>Email: {siteConfig.email}</li>
          </ul>
        </div>

        <p className="text-sm text-slate-500">
          By using our website or WhatsApp service, you agree to this Privacy Policy.
        </p>
      </div>
    </section>
  );
}
