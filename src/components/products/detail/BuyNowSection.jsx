// src/components/products/detail/BuyNowSection.jsx
"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import ProductPurchaseModal from "@/components/products/ProductPurchaseModal";
import ProductOrderConfirmation from "@/components/products/ProductOrderConfirmation";

export default function BuyNowSection({ product }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleSuccess = (details) => {
    const orderId = `ORD${Date.now().toString().slice(-8)}`;
    setOrderDetails({ ...details, orderId, productImage: product.image });
    setShowModal(false);
    setShowConfirmation(true);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={!product.inStock}
        className="w-full py-s16 rounded-r16 bg-primary-main text-background font-medium flex items-center justify-center gap-s8 hover:bg-primary-light transition-colors disabled:opacity-50"
      >
        <ShoppingBag size={18} />
        {product.inStock ? "Buy Now" : "Out of Stock"}
      </button>

      {showModal && (
        <ProductPurchaseModal
          product={product}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      <ProductOrderConfirmation
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setOrderDetails(null);
        }}
        orderDetails={orderDetails}
      />
    </>
  );
}