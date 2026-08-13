import Link from "next/link";
import { Globe, Mail } from "lucide-react";

import PrivacyPolicySection from "@/components/legal/PrivacyPolicySection";
import { PRIVACY_POLICY_DATA } from "@/data/privacyPolicy";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background pt-s104 pb-s104">

      <div className="mx-auto max-w-5xl px-s16 lg:px-s32">

        {/* Header */}
        <header className="mb-s64 max-w-3xl">

          <p className="caption mb-s12 font-semibold uppercase tracking-[0.18em] text-secondary">
            Legal
          </p>

          <h1 className="heading-h1 text-main">
            {PRIVACY_POLICY_DATA.title}
          </h1>

          <p className="body-large mt-s16 text-secondary">
            Learn how Rantraa collects, uses, protects, and manages your
            personal information.
          </p>

        </header>

        {/* Introduction */}
        <section className="mb-s48">

          <h2 className="heading-h3 mb-s24 text-main">
            {PRIVACY_POLICY_DATA.intro.title}
          </h2>

          <div className="space-y-s16">
            {PRIVACY_POLICY_DATA.intro.paragraphs.map(
              (paragraph, index) => (
                <p
                  key={index}
                  className="body-default leading-7 text-secondary"
                >
                  {paragraph}
                </p>
              )
            )}
          </div>

        </section>

        {/* Policy Sections */}
        <div className="space-y-s40">
          {PRIVACY_POLICY_DATA.sections.map((section) => (
            <PrivacyPolicySection
              key={section.number}
              section={section}
            />
          ))}
        </div>

        {/* Contact */}
        <section className="mt-s48 rounded-r24 bg-secondary-main p-s24 lg:p-s32">

          <h2 className="heading-h4 text-main">
            Privacy & Data Contact
          </h2>

          <p className="body-default mt-s12 text-secondary">
            For privacy-related questions, requests, complaints, or
            grievances, contact Rantraa through the details below.
          </p>

          <div className="mt-s24 flex flex-col gap-s16 sm:flex-row">

            <a
              href={`mailto:${PRIVACY_POLICY_DATA.contact.email}`}
              className="flex items-center gap-s8 text-secondary transition-colors hover:text-main"
            >
              <Mail size={18} />
              {PRIVACY_POLICY_DATA.contact.email}
            </a>

            <Link
              href={PRIVACY_POLICY_DATA.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-s8 text-secondary transition-colors hover:text-main"
            >
              <Globe size={18} />
              new-rantraa.vercel.app
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}