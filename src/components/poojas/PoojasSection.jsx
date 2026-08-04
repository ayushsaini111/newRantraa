import OnlineSection from "./OnlineSection";
import OnsiteSection from "./OnsiteSection";

import {
  ONLINE_POOJAS,
  ONSITE_POOJAS,
} from "@/data/poojas";

export default function PoojasSection() {
  return (
    <section className="py-s104">

        {/* Header */}

        <div
          className="
            flex
            flex-col
            items-center
            text-center
            gap-s16
            max-w-3xl
            mx-auto
          "
        >

          <span
            className="
              caption
              uppercase
              tracking-[3px]
              text-primary-main
              font-semibold
            "
          >
            Sacred Rituals
          </span>

          <h2 className="heading-h1 text-main">
            Popular Poojas
          </h2>

          <p className="body-large text-secondary">
            Discover the most loved Vedic rituals performed by experienced
            Pandit Ji. Choose between Online participation from anywhere or
            hassle-free On-site pooja at your home.
          </p>

        </div>
      <div className=" mx-auto pl-4 lg:pl-s160 ">


        {/* Sections */}

        <div className="mt-s104 flex flex-col gap-s104">

          <OnlineSection
            data={ONLINE_POOJAS}
          />

          <OnsiteSection
            data={ONSITE_POOJAS}
          />

        </div>

      </div>

    </section>
  );
}