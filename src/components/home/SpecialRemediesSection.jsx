"use client";

import Image from "next/image";
import Link from "next/link";

const REMEDIES = [
  {
    title: "Shiv ji Pooja",
    filter: "shiv-ji-pooja",
    image: "/poojas/remedies/shiv-ji.png",
    badge: "Seven Special",
  },
  {
    title: "Wealth & Prosperity",
    filter: "wealth-prosperity",
    image: "/poojas/remedies/lakshmi.png",
  },
  {
    title: "Home & Family",
    filter: "home-family",
    image: "/poojas/remedies/home-family.png",
    badge: "Trending",
  },
  {
    title: "Planetary Remedies",
    filter: "planetary-remedies",
    image: "/poojas/remedies/planetary.png",
  },
  {
    title: "Career & Business",
    filter: "career-business",
    image: "/poojas/remedies/career.png",
  },
  {
    title: "Love & Marriage",
    filter: "love-marriage",
    image: "/poojas/remedies/marriage.png",
  },
  {
    title: "Health & Protection",
    filter: "health-protection",
    image: "/poojas/remedies/health.png",
  },
  {
    title: "Vastu Shanti",
    filter: "vastu-shanti",
    image: "/poojas/remedies/vastu.png",
    badge: "Home position",
  },
];

export default function SpecialRemediesSection() {
  return (
    <section className="bg-background py-s80 lg:py-s104">
      <div className="mx-auto max-w-7xl px-s16 sm:px-s24 lg:px-s32">

        {/* Header */}
        <div className="mb-s40 flex items-start justify-between gap-s24">
          <div className="max-w-2xl">
            <h2 className="heading-h2 text-main">
              Special Remedies
            </h2>

            <p className="body-small mt-s8 text-secondary">
              Book online ePoojas performed by experienced pandits on your
              behalf. Receive the sacred blessings and spiritual benefits
              from your home.
            </p>
          </div>

          <Link
            href="/poojas/all?mode=Online"
            className="
              hidden
              shrink-0
              pt-s8
              body-small
              font-medium
              text-main
              transition-opacity
              hover:opacity-60
              sm:block
            "
          >
            View All Remedies
          </Link>
        </div>

        {/* Remedies */}
        <div className="grid grid-cols-2 gap-s16 sm:grid-cols-4 lg:gap-s24">
          {REMEDIES.map((remedy) => (
            <Link
              key={remedy.filter}
              href={`/poojas/all?mode=Online&filter=${remedy.filter}`}
              className="
                group
                relative
                aspect-square
                overflow-hidden
                rounded-r8
                bg-secondary-main
              "
            >
              {/* Image */}
              <Image
                src={remedy.image}
                alt={remedy.title}
                fill
                sizes="
                  (max-width: 640px) 50vw,
                  (max-width: 1024px) 25vw,
                  220px
                "
                className="
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />

              {/* Bottom overlay */}
              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  bg-gradient-to-t
                  from-black/70
                  via-black/20
                  to-transparent
                  px-s16
                  pb-s16
                  pt-s48
                "
              >
                <h3 className="body-default font-medium text-white">
                  {remedy.title}
                </h3>
              </div>

              {/* Badge */}
              {remedy.badge && (
                <span
                  className="
                    absolute
                    left-0
                    top-s8
                    rounded-r8
                    rounded-l-none
                    bg-red-main
                    px-s8
                    py-[3px]
                    text-[10px]
                    font-medium
                    text-white
                  "
                >
                  {remedy.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <Link
          href="/poojas/all?mode=Online"
          className="
            mt-s24
            block
            text-center
            body-small
            font-medium
            text-main
            sm:hidden
          "
        >
          View All Remedies
        </Link>
      </div>
    </section>
  );
}