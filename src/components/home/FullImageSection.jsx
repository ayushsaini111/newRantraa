"use client";

import Image from "next/image";

export default function FullImageSection({
  src="/om.PNG",
  alt = "",
}) {
  return (
    <section className="w-full">
      <div className="relative w-full py-s104 aspect-[16/6] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-[50%] mb-s104"
        />
      </div>
    </section>
  );
}