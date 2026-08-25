"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import Button from "@/components/ui/Button";

function ProductCard({ product }) {
  const router = useRouter();

  if (!product) return null;

  const handleBuyClick = (e) => {
    e.stopPropagation();
    router.push(`/allproducts/${product.id}`);
  };

  return (
    <div
      onClick={handleBuyClick}
      className="
        overflow-hidden
        rounded-r24
        bg-white
        border
        border-[#E8DED5]
        cursor-pointer
        hover:shadow-lg
        transition-shadow
      "
    >
      {/* IMAGE */}
      <div className="relative h-[270px] bg-[#F6F1EB] overflow-hidden">
        <Image
          src={product.image }
          alt={product.title || "Product"}
          fill
          className="
            object-cover
            w-full
            h-full
            hover:scale-105
            transition-transform
            duration-300
          "
        />

        {/* Discount */}
        {product.originalPrice && (
          <div className="
            absolute
            top-s16
            left-s16
            bg-red-500
            text-white
            px-s8
            py-s4
            rounded-r8
            text-xs
            font-semibold
          ">
            {Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )}
            % OFF
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-s16 flex flex-col gap-s8">
        <div className="flex flex-col gap-s6">

          {/* Title */}
          <h3 className="
            body-small
            text-main
            line-clamp-2
            font-medium
          ">
            {product.title || "Untitled Product"}
          </h3>

          {/* Description */}
          <p className="
            text-xs
            text-secondary
            leading-relaxed
            line-clamp-1
          ">
            {product.shortDescription ||
              product.description ||
              "No description"}
          </p>

          {/* Rating */}
          {product.rating && product.reviews && (
            <div className="flex items-center gap-s4">
              <div className="flex items-center gap-s2">
                <Star
                  size={12}
                  fill="#F59E0B"
                  stroke="#F59E0B"
                />

                <span className="text-xs font-medium text-main">
                  {product.rating}
                </span>
              </div>

              <span className="text-xs text-secondary">
                ({product.reviews})
              </span>
            </div>
          )}
        </div>

        {/* PRICE + BUY */}
        <div className="flex items-center justify-between">

          <div className="flex flex-col-reverse  ">
            <span className="text-sm font-semibold text-main">
              ₹{product.price || 0}
            </span>

            {product.originalPrice && (
              <span className="text-xs text-secondary line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            onClick={handleBuyClick}
            className="!h-s36 !px-s16 text-xs"
          >
            Buy
          </Button>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;