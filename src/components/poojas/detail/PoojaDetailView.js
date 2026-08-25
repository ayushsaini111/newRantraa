// src/components/poojas/detail/PoojaDetailView.js
import Image from "next/image";
import Link from "next/link";
import {
  Clock, Video, Home, Star, Users, CheckCircle, Languages, Sparkles,
} from "lucide-react";
import BookNowButton from "./BookNowButton";
import FaqAccordion from "./FaqAccordion";

export default function PoojaDetailView({ pooja, content, testimonials }) {
  const discount = pooja.price > 0
    ? Math.round(((pooja.price - pooja.offer_price) / pooja.price) * 100)
    : 0;

  return (
    <main className="min-h-screen mt-s80 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-secondary mb-6 sm:mb-8">
          <Link href="/" className="hover:text-primary-main">Home</Link>
          <span>/</span>
          <Link href="/poojas" className="hover:text-primary-main">Poojas</Link>
          <span>/</span>
          <span className="text-main line-clamp-1">{pooja.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image */}
          <div className="space-y-4 sm:space-y-6">
            <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[500px] bg-secondary-main/20 rounded-2xl sm:rounded-r32 overflow-hidden">
              <Image
                src={pooja.image}
                alt={pooja.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4 sm:p-8"
                priority
              />
              {pooja.popular && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary-main text-background px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                  Popular
                </div>
              )}
              {content?.hero_access && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-background/90 text-primary-main px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                  {content.hero_access}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-secondary-main/20 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-2 text-primary-main mb-1">
                  <Star size={18} className="shrink-0" fill="currentColor" />
                  <span className="text-base sm:text-lg font-bold text-main">{pooja.rating}</span>
                </div>
                <p className="text-xs sm:text-sm text-secondary">Rating</p>
              </div>
              <div className="bg-secondary-main/20 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={18} className="text-primary-main shrink-0" />
                  <span className="text-base sm:text-lg font-bold text-main">{pooja.bookings}</span>
                </div>
                <p className="text-xs sm:text-sm text-secondary">Bookings</p>
              </div>
            </div>

            {content?.hero_benefits?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.hero_benefits.map((b, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-primary-main/10 text-primary-main text-xs sm:text-sm font-medium rounded-full"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right - Details */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1 className="heading-h2 text-main mb-3 sm:mb-4">{pooja.title}</h1>
              <p className="body-large text-secondary leading-relaxed">
                {content?.hero_subtitle || pooja.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-primary-main/5 p-4 sm:p-6 rounded-xl border border-primary-main/20">
              <div className="flex flex-wrap items-end gap-2 sm:gap-4 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-main">₹{pooja.offer_price}</span>
                <span className="text-lg sm:text-2xl text-secondary line-through mb-1">₹{pooja.price}</span>
                {discount > 0 && (
                  <span className="bg-primary-main text-background px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold mb-1">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-secondary">Inclusive of all taxes and materials</p>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="heading-h5 text-main">Key Features</h3>
              <div className="grid gap-4">
                <FeatureRow icon={<Clock size={20} className="text-primary-main" />} label="Duration" value={pooja.duration} />
                <FeatureRow
                  icon={pooja.mode === "Video Call" ? <Video size={20} className="text-accent-main" /> : <Home size={20} className="text-accent-main" />}
                  label="Mode"
                  value={pooja.mode}
                  bg="bg-accent-main/10"
                />
                <FeatureRow
                  icon={<Languages size={20} className="text-primary-main" />}
                  label="Languages"
                  value={
                    pooja.pooja_languages?.length > 0
                      ? pooja.pooja_languages.map((l) => l.language).join(", ")
                      : "Hindi, English"
                  }
                />
              </div>
            </div>

            {/* CTA — Client Component (interactive) */}
            <BookNowButton pooja={pooja} />
          </div>
        </div>

        {/* About */}
        <section className="mt-12 sm:mt-16 bg-secondary-main/10 p-6 sm:p-8 rounded-xl">
          <h3 className="heading-h3 text-main mb-4 sm:mb-6">
            {content?.about_title || `About ${pooja.title}`}
          </h3>
          <div className="prose max-w-none text-secondary space-y-4 text-sm sm:text-base">
            <p>
              {content?.about_content ||
                `${pooja.title} is a sacred Vedic ritual performed to invoke divine blessings and positive energy.`}
            </p>
            <p>
              {pooja.mode === "Video Call"
                ? "Join from anywhere via video call and participate in real-time. You'll receive a complete list of required items before the pooja."
                : "Our Pandit Ji will arrive at your home with all necessary pooja materials, making it completely hassle-free for you."}
            </p>
          </div>
        </section>

        {/* Live Experience */}
        {content?.live_content && (
          <section className="mt-6 sm:mt-8 bg-primary-main/5 p-6 sm:p-8 rounded-xl border border-primary-main/20">
            <div className="flex items-start gap-3">
              <Sparkles size={22} className="text-primary-main shrink-0 mt-1" />
              <div>
                <h3 className="heading-h4 text-main mb-2 sm:mb-3">{content.live_title}</h3>
                <p className="text-secondary leading-relaxed text-sm sm:text-base">{content.live_content}</p>
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        {content?.how_it_works?.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <h3 className="heading-h3 text-main mb-6 sm:mb-8 text-center">How It Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {content.how_it_works.map((step, i) => (
                <div key={i} className="bg-background border border-secondary-dark rounded-xl p-5 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary-main/30 mb-2 sm:mb-3">{step.step}</div>
                  <h4 className="font-bold text-main mb-2 text-sm sm:text-base">{step.title}</h4>
                  <p className="text-xs sm:text-sm text-secondary leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Process */}
        {content?.process_steps?.length > 0 && (
          <section className="mt-12 sm:mt-16 bg-secondary-main/10 p-6 sm:p-8 rounded-xl">
            <h3 className="heading-h3 text-main mb-3">What Happens During the Pooja?</h3>
            {content.process_intro && <p className="text-secondary mb-6 text-sm sm:text-base">{content.process_intro}</p>}
            <div className="space-y-3">
              {content.process_steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-background rounded-xl border border-secondary-dark">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary-main text-background rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-main text-sm sm:text-base">{step.title}</p>
                    <p className="text-xs sm:text-sm text-secondary mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Preparation */}
        {(content?.preparation_required?.length > 0 || content?.preparation_optional?.length > 0) && (
          <section className="mt-12 sm:mt-16">
            <h3 className="heading-h3 text-main mb-3">What Should I Prepare at Home?</h3>
            {content.preparation_note && <p className="text-secondary mb-6 text-sm sm:text-base">{content.preparation_note}</p>}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {content.preparation_required?.length > 0 && (
                <PrepCard title="You Need:" items={content.preparation_required} color="primary" />
              )}
              {content.preparation_optional?.length > 0 && (
                <PrepCard title="Optional:" items={content.preparation_optional} color="accent" />
              )}
            </div>
          </section>
        )}

        {/* Cultural Roots */}
        {(content?.cultural_story || content?.cultural_chapters?.length > 0) && (
          <section className="mt-12 sm:mt-16">
            <h3 className="heading-h3 text-main mb-4 sm:mb-6">
              {content.cultural_title || "Cultural Roots & Connection"}
            </h3>
            {content.cultural_story && (
              <p className="text-secondary leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">{content.cultural_story}</p>
            )}
            {content.cultural_chapters?.length > 0 && (
              <div className="space-y-4">
                {content.cultural_chapters.map((ch, i) => (
                  <div key={i} className="bg-secondary-main/10 p-5 sm:p-6 rounded-xl border border-secondary-dark">
                    <p className="text-xs font-bold text-primary-main mb-1">CHAPTER {ch.chapter}</p>
                    <h4 className="font-bold text-main mb-2 text-sm sm:text-base">{ch.title}</h4>
                    <p className="text-xs sm:text-sm text-secondary leading-relaxed">{ch.description}</p>
                  </div>
                ))}
              </div>
            )}
            {content.cultural_closing && (
              <p className="text-secondary leading-relaxed mt-6 sm:mt-8 text-sm sm:text-base">{content.cultural_closing}</p>
            )}
          </section>
        )}

        {/* FAQ — Client Component (only toggle state needs JS) */}
        {content?.faqs?.length > 0 && <FaqAccordion faqs={content.faqs} />}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <h3 className="heading-h3 text-main mb-6 sm:mb-8 text-center">What Families Say</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-background border border-secondary-dark rounded-xl p-5 sm:p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < t.rating ? "text-primary-main" : "text-secondary-main"} fill={i < t.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-sm text-secondary italic leading-relaxed mb-4">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-main text-sm">{t.name}</p>
                    {t.location && <p className="text-xs text-secondary">{t.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Closing CTA */}
        {(content?.closing_title || content?.closing_description) && (
          <section className="mt-12 sm:mt-16 bg-primary-main p-6 sm:p-10 rounded-2xl text-center text-background">
            <h3 className="heading-h3 mb-3 sm:mb-4">{content.closing_title}</h3>
            <p className="text-background/80 max-w-2xl mx-auto mb-5 sm:mb-6 text-sm sm:text-base">{content.closing_description}</p>
            <BookNowButton
              pooja={pooja}
              className="!bg-background !text-primary-main hover:!bg-secondary-main !w-auto px-8"
              label="Book Your Pooja"
            />
            {content.closing_tags?.length > 0 && (
              <p className="text-xs sm:text-sm text-background/70 mt-4">{content.closing_tags.join(" · ")}</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function FeatureRow({ icon, label, value, bg = "bg-primary-main/10" }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <p className="font-semibold text-main text-sm sm:text-base">{label}</p>
        <p className="text-xs sm:text-sm text-secondary">{value}</p>
      </div>
    </div>
  );
}

function PrepCard({ title, items, color }) {
  const styles = color === "primary"
    ? { bg: "bg-primary-main/5", border: "border-primary-main/20", icon: "text-primary-main" }
    : { bg: "bg-accent-main/5", border: "border-accent-main/20", icon: "text-accent-main" };

  return (
    <div className={`${styles.bg} p-5 sm:p-6 rounded-xl border ${styles.border}`}>
      <p className="font-semibold text-main mb-3 text-sm sm:text-base">{title}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle size={16} className={`${styles.icon} shrink-0`} />
            <span className="text-xs sm:text-sm text-secondary">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}