import Link from "next/link";
import { Mail, Globe } from "lucide-react";

import TermsSection from "@/components/legal/TermsSection";
import { TERMS_DATA } from "@/data/terms";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-background pt-s160 pb-s104">
      <div className="mx-auto max-w-5xl px-s16 lg:px-s32">

        {/* Header */}
        <header className="mb-s64 max-w-3xl">
          <p className="caption mb-s12 font-semibold uppercase tracking-[0.18em] text-secondary">
            Legal
          </p>

          <h1 className="heading-h1 text-main">
            {TERMS_DATA.title}
          </h1>

          <p className="body-large mt-s16 text-secondary">
            Please read these terms carefully before using the Rantraa
            platform or booking any service.
          </p>
        </header>

        {/* Introduction */}
        <section className="mb-s48">
          <h2 className="heading-h3 mb-s24 text-main">
            {TERMS_DATA.intro.title}
          </h2>

          <div className="space-y-s16">
            {TERMS_DATA.intro.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="body-default leading-7 text-secondary"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Terms */}
        <div className="space-y-s40">
          {TERMS_DATA.sections.map((section) => (
            <TermsSection
              key={section.number}
              section={section}
            />
          ))}
        </div>

        {/* Contact */}
        <section className="mt-s48 rounded-r24 bg-secondary-main p-s24 lg:p-s32">
          <h2 className="heading-h4 text-main">
            Contact Rantraa
          </h2>

          <div className="mt-s24 flex flex-col gap-s16 sm:flex-row">
            <a
              href={`mailto:${TERMS_DATA.contact.email}`}
              className="flex items-center gap-s8 text-secondary transition-colors hover:text-main"
            >
              <Mail size={18} />
              {TERMS_DATA.contact.email}
            </a>

            <Link
              href={TERMS_DATA.contact.website}
              target="_blank"
              className="flex items-center gap-s8 text-secondary transition-colors hover:text-main"
            >
              <Globe size={18} />
              new-rantraa.vercel.app
            </Link>
          </div>
        </section>

        {/* Acknowledgement */}
        <section className="mt-s32 rounded-r24 border border-black/10 bg-white p-s24 lg:p-s32">
          <h2 className="heading-h4 mb-s16 text-main">
            Acknowledgement
          </h2>

          <p className="body-default leading-7 text-secondary">
            {TERMS_DATA.acknowledgement}
          </p>
        </section>

      </div>
    </main>
  );
}