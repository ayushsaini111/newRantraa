"use client";

import Image from "next/image";
import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Poojas", href: "/poojas" },
      { label: "Consult Experts", href: "/consult" },
      { label: "Horoscope", href: "/astrology/horoscope" },
      { label: "Kundali", href: "/astrology/kundali-making" },
      { label: "Kundali Matching", href: "astrology/kundali-matching" },
    ],
  },
  {
    title: "Knowledge",
    links: [
      { label: "Articles", href: "/" },
      { label: "Vedic Guidance", href: "/" },
      { label: "Spirituality", href: "/" },
      { label: "Pooja Guide", href: "/poojas" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Online e-Pooja", href: "/poojas/all?mode=Online" },
      { label: "At-Home Pooja", href: "/poojas/all?mode=On-site" },
      { label: "Pandit Consultation", href: "/consult" },
      { label: "Vastu Guidance", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-primary-light/30">
      <div className="mx-auto max-w-7xl px-s16 pb-s24 pt-s80 lg:px-s32 lg:pt-s104">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-s48 md:grid-cols-12 lg:gap-s32">

          {/* Logo */}
          <div className="md:col-span-4 lg:col-span-4">
            <Link
              href="/"
              aria-label="Rantraa"
              className="block"
            >
              <div className="relative h-[180px] w-[260px]">
                <Image
                  src="/rr.png"
                  alt="Rantraa"
                  fill
                  sizes="660px"
                  className="object-cover object-left"
                />
              </div>
            </Link>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-x-s32 gap-y-s48 md:col-span-8 md:grid-cols-4 lg:gap-x-s48">
            {FOOTER_COLUMNS.map((column) => (
              <FooterColumn
                key={column.title}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-s64 flex flex-col gap-s16 border-t border-black/10 pt-s24 sm:flex-row sm:items-center sm:justify-between">

          {/* Copyright */}
          <p className="text-xs text-secondary">
            © {new Date().getFullYear()} Rantraa. All Rights Reserved.
          </p>

          {/* Developer */}
          <p className="text-xs text-secondary">
            Design &amp; Developed by{" "}
            <a
              href="#"
              className="text-main underline underline-offset-2 transition-opacity hover:opacity-60"
            >
              Oryvia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------------
   FOOTER COLUMN
-------------------------------- */

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-main">
        {title}
      </h3>

      <ul className="mt-s24 space-y-s16">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="
                text-md
                leading-5
                text-secondary
                transition-colors
                hover:text-main
              "
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}