// src/components/poojas/PoojasSection.js
import OnlineSection from "./OnlineSection";
import OnsiteSection from "./OnsiteSection";

export default function PoojasSection({ onlinePoojas, onsitePoojas }) {
  const onlineData = {
    title: "Online",
    description:
      "If you don't have time to perform pooja at home, book a virtual pooja with experienced Pandit Ji. Participate live from anywhere with complete guidance and receive divine blessings without leaving your home.",
    cards: onlinePoojas,
  };

  const onsiteData = {
    title: "On-site",
    description:
      "If you want a hassle-free pooja at your home, book an on-site pooja. Our Pandit Ji will visit with complete pooja samagri and perform every ritual according to Vedic traditions.",
    feature: {
      title: "100% Hassle-Free",
      description: "No arrangements needed. Pandit Ji arrives with all required pooja samagri.",
    },
    cards: onsitePoojas,
  };

  return (
    <section className="py-s48 sm:py-s64 lg:py-s104">
      <div className="flex flex-col items-center text-center gap-s16 sm:gap-s24 max-w-3xl mx-auto px-s16 sm:px-s24">
        <span className="caption uppercase tracking-[3px] text-primary-main font-semibold">
          Sacred Rituals
        </span>
        <h2 className="heading-h3 sm:heading-h2 lg:heading-h1 text-main">Popular Poojas</h2>
        <p className="body-small sm:body-default lg:body-large text-secondary">
          Discover the most loved Vedic rituals performed by experienced Pandit Ji.
          Choose between Online participation from anywhere or hassle-free On-site
          pooja at your home.
        </p>
      </div>

      <div className="mx-auto">
        <div className="mt-s48 sm:mt-s64 lg:mt-s104 flex flex-col gap-s48 sm:gap-s64 lg:gap-s104">
          <div className="lg:pl-s160">
            <OnlineSection data={onlineData} />
          </div>
          <OnsiteSection data={onsiteData} />
        </div>
      </div>
    </section>
  );
}