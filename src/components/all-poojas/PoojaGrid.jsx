"use client";

import PoojaCard from "@/components/poojas/PoojaCard";
import { SearchX } from "lucide-react";

export default function PoojaGrid({ poojas }) {
  if (!poojas.length) {
    return (
      <div className="py-s104">
        <div
          className="
            mx-auto
            max-w-xl
            rounded-r32
            border
            border-black/5
            bg-white
            p-s48
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-secondary-main
            "
          >
            <SearchX
              size={40}
              className="text-primary-main"
            />
          </div>

          <h2 className="heading-h3 mt-s24">
            No Poojas Found
          </h2>

          <p className="body-default mt-s16 text-secondary">
            We couldn't find any poojas matching your search
            or selected filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-s48 flex justify-center">
      <div
        className="
          grid
          gap-s32
          grid-cols-1 
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {poojas.map((pooja) => (
          <PoojaCard
            key={pooja.id}
            data={pooja}
          />
        ))}
      </div>
    </section>
  );
}