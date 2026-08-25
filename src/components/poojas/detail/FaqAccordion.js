// src/components/poojas/detail/FaqAccordion.js
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ faqs }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="mt-12 sm:mt-16">
      <h3 className="heading-h3 text-main mb-4 sm:mb-6">Frequently Asked Questions</h3>
      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openFaq === i;
          return (
            <div key={i} className="border border-secondary-dark rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left bg-background hover:bg-secondary-main/10 transition-colors"
              >
                <span className="font-medium text-main text-sm sm:text-base">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`text-secondary shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="p-4 pt-0 text-xs sm:text-sm text-secondary leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}