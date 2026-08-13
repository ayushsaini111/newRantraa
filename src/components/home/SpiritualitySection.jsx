// components/SpiritualitySection.jsx

"use client";

import SpiritualityContent from "@/data/spirituality";

export default function SpiritualitySection() {
  const { title, sections } = SpiritualityContent;

  return (
    <section className="w-full bg-background py-s80 lg:py-s84">
      <div className="mx-auto max-w-6xl px-s16 lg:px-s0">
        {/* Main Title */}
        <header className="mb-s48 lg:mb-s64">
          <h1 className="heading-h2 text-main max-w-5xl">
            {title}
          </h1>
        </header>

        {/* Content */}
        <div className="space-y-s64 lg:space-y-s80">
          {sections.map((section) => (
            <article
              key={section.id}
              className="max-w-5xl"
            >
              {/* Section Heading */}
              <h2 className="heading-h3 text-main">
                {section.title}
              </h2>

              {/* Normal paragraphs */}
              {section.paragraphs?.length > 0 && (
                <div className="mt-s24 space-y-s16">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="heading-h6 max-w-5xl leading-7 text-secondary"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Nested service sections */}
              {section.subsections?.length > 0 && (
                <div className="mt-s32 space-y-s40">
                  {section.subsections.map((subsection) => (
                    <div
                      key={subsection.title}
                      className="max-w-5xl"
                    >
                      <h3 className="heading-h3 text-main">
                        {subsection.title}
                      </h3>

                      <div className="mt-s16 space-y-s16">
                        {subsection.paragraphs.map(
                          (paragraph, index) => (
                            <p
                              key={index}
                              className="body-default max-w-4xl leading-7 text-secondary"
                            >
                              {paragraph}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}