import { ShieldCheck } from "lucide-react";

export default function TermsSection({ section }) {
  return (
    <section className="border-b border-black/10 pb-s40">
      <div className="flex items-start gap-s16">
        

        <div className="min-w-0">
          <div className="mb-s16 flex items-center gap-s8">
            <span className="heading-h4 font-semibold text-main">
              {section.number   }.
            </span>

            <h2 className="heading-h4 text-main">
              {section.title}
            </h2>
          </div>

          <div className="space-y-s16">
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="body-default leading-7 text-secondary"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}