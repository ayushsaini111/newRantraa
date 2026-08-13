"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import FAQS from "@/data/faqs";

export default function FaqSection() {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="w-full bg-background py-s80 lg:py-s104">
      <div className="mx-auto max-w-7xl px-s16 lg:px-s32">
        {/* Header */}
        <div className="mb-s40">
          <h2 className="heading-h2 text-main">
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="flex flex-col gap-s16">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={isOpen}
                onToggle={() => toggleFaq(faq.id)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------
   FAQ ITEM
-------------------------------- */

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div
      className={`
        overflow-hidden
        rounded-r24
        border
        transition-all
        duration-300
        ${
          isOpen
            ? "border-primary-main/20 bg-primary-main/[0.04]"
            : "border-transparent bg-gray-100"
        }
      `}
    >
      {/* Question */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-s24
          px-s24
          py-s16
          text-left
          transition-colors
          hover:bg-black/[0.03]
          lg:px-s24
          lg:py-s24
        "
      >
        <span
          className={`
            body-large
            font-medium
            leading-relaxed
            transition-colors
            ${
              isOpen
                ? "text-main"
                : "text-main"
            }
          `}
        >
          {faq.question}
        </span>

        {/* Icon */}
        <span
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-black
            text-white
            transition-transform
            duration-300
            ${
              isOpen
                ? "rotate-0"
                : "rotate-0"
            }
          `}
        >
          {isOpen ? (
            <X size={16} strokeWidth={2} />
          ) : (
            <Plus size={16} strokeWidth={2} />
          )}
        </span>
      </button>

      {/* Answer */}
      <div
        className={`
          grid
          transition-all
          duration-300
          ${
            isOpen
              ? "grid-rows-[1fr]"
              : "grid-rows-[0fr]"
          }
        `}
      >
        <div className="overflow-hidden">
          <div className="px-s24 pb-s24 lg:pr-20">
            <div className="h-px w-full bg-black/5" />

            <p className="body-default pt-s16 leading-7 text-secondary">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}