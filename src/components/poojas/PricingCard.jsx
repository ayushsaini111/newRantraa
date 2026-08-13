"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import useCheckoutStore from "@/store/checkoutStore";

export default function PoojaCard({ data }) {
    console.log("PoojaCard data:", data); // Debugging line
  const router = useRouter();
  const setPooja = useCheckoutStore((state) => state.setPooja);

  const handleBook = () => {
    // Save pooja for checkout
    setPooja(data);
    // Direct navigation - checkout page handles auth
    router.push(`/checkout?poojaId=${data.id}`);
  };

  const handleKnowMore = () => {
    router.push(`/poojas/${data.id}`);
  };

  return (
    <article className="w-[230px] sm:w-[245px] xl:w-[300px] bg-gray-200 rounded-r32 p-s24 flex flex-col border border-black/5 shrink-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="!h-8 !px-4 !text-xs"
          onClick={handleBook}
        >
          Book
        </Button>

        <Button className="!h-8 !px-4 !text-xs" onClick={handleKnowMore}>
          Know more
        </Button>
      </div>

      {/* Title */}
      <h3 className="mt-s24 text-[22px] font-semibold text-main leading-tight font-secondary">
        {data.title}
      </h3>

      {/* Image */}
      <div className="relative w-full h-[190px] mt-s24">
        <Image
          src={data.image}
          alt={data.title}
          fill
          sizes="250px"
          className="object-contain"
        />
      </div>

      {/* Subtitle */}
      <h4 className="mt-s24 text-[17px] leading-snug font-semibold text-main">
        {data.short_description}
      </h4>

      {/* Description */}
      <p className="mt-s8 text-[14px] leading-6 text-secondary">
        {data.description}
      </p>

      {/* Price */}
      <div className="mt-auto pt-s16 flex items-center gap-s8">
        <span className="text-lg font-bold text-main">₹{data.offer_price}</span>
        <span className="text-sm text-secondary line-through">₹{data.price}</span>
      </div>
    </article>
  );
}