// src/components/products/detail/ProductDetailView.jsx
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import BuyNowSection from "./BuyNowSection";
import ProductCard from "../ProductCard";

export default function ProductDetailView({ product, related }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen mt-s80 bg-background">
      <div className="max-w-7xl mx-auto px-s16 lg:px-s40 py-s32 lg:py-s64">
        <div className="lg:grid lg:grid-cols-2 lg:gap-s64 space-y-s40 lg:space-y-0">

          {/* Left — Images */}
          <div className="space-y-s16">
            <div className="relative w-full aspect-square rounded-r24 overflow-hidden bg-secondary-main/20">
              <Image
                src={product.image || product.images?.[0] || "/Products/product-1.png"}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-s16 left-s16 bg-red-main text-background px-s16 py-s6 rounded-r16 font-semibold body-small">
                  {discount}% OFF
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-s16 overflow-x-auto hide-scrollbar">
                {product.images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-r16 overflow-hidden shrink-0 border border-secondary-dark">
                    <Image src={img} alt={`${product.title} ${idx + 1}`} fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div className="space-y-s24">
            <div className="space-y-s16">
              <h1 className="heading-h3 text-main">{product.title}</h1>
              <p className="body-default text-secondary">
                {product.shortDescription || product.description}
              </p>

              <div className="flex items-center gap-s16">
                <div className="flex items-center gap-s4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.floor(product.rating || 0) ? "var(--accent-main)" : "none"}
                      stroke="var(--accent-main)"
                    />
                  ))}
                  <span className="body-small text-main font-medium ml-s4">{product.rating || 0}</span>
                </div>
                <span className="body-small text-secondary">({product.reviews || 0} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-s16">
              <span className="heading-h4 text-primary-main">₹{product.price}</span>
              {product.originalPrice && (
                <span className="heading-h6 text-secondary line-through">₹{product.originalPrice}</span>
              )}
            </div>

            <div className="flex items-center gap-s8">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-primary-main" : "bg-red-main"}`} />
              <span className="body-small font-medium" style={{ color: product.inStock ? "var(--primary-main)" : "var(--red-main)" }}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {product.benefits?.length > 0 && (
              <div className="space-y-s16">
                <h3 className="heading-h6 text-main">Key Benefits</h3>
                <div className="space-y-s8">
                  {product.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-s8">
                      <div className="w-5 h-5 rounded-full bg-primary-main/10 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--primary-main)" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <span className="body-default text-secondary">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buy Now — Client Component */}
            <BuyNowSection product={product} />

            {/* ✅ CONSULT A PANDIT CTA — "Is this right for you?" */}
            <Link
              href={`/consult?ref=product&productId=${product.id}&productTitle=${encodeURIComponent(product.title)}`}
              className="flex items-center gap-s16 p-s16 rounded-r16 border border-primary-main/20 bg-primary-main/5 hover:bg-primary-main/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary-main/10 flex items-center justify-center shrink-0">
                <Sparkles size={22} className="text-primary-main" />
              </div>
              <div className="flex-1">
                <p className="body-default font-semibold text-main">
                  Not sure if this is right for you?
                </p>
                <p className="body-small text-secondary">
                  Talk to our expert Pandit Ji for personalized guidance
                </p>
              </div>
              <ArrowRight size={20} className="text-primary-main shrink-0" />
            </Link>
          </div>
        </div>

        {/* Description */}
        <div className="mt-s64 space-y-s40">
          <div className="space-y-s16">
            <h2 className="heading-h4 text-main">About This Product</h2>
            <p className="body-default text-secondary leading-relaxed">
              {product.longDescription || product.description || "No detailed description available."}
            </p>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-s16">
              <h3 className="heading-h5 text-main">Specifications</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-s16">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-secondary-dark pb-s8">
                    <span className="body-default text-secondary capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="body-default text-main font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {product.testimonials?.length > 0 && (
            <div className="space-y-s24">
              <h3 className="heading-h5 text-main">Customer Reviews</h3>
              <div className="grid sm:grid-cols-2 gap-s16">
                {product.testimonials.map((review, idx) => (
                  <div key={idx} className="bg-background border border-secondary-dark rounded-r16 p-s24">
                    <div className="flex items-start justify-between mb-s16">
                      <div>
                        <h4 className="body-default font-semibold text-main">{review.name}</h4>
                        <p className="body-small text-secondary">{review.location}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="var(--accent-main)" stroke="var(--accent-main)" />
                        ))}
                      </div>
                    </div>
                    <p className="body-default text-secondary leading-relaxed">{review.text}</p>
                    <p className="caption text-secondary/60 mt-s8">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Related Products */}
          {related?.length > 0 && (
            <div className="space-y-s24">
              <h3 className="heading-h5 text-main">You May Also Like</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-s16">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}