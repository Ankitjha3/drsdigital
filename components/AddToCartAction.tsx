"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";

interface AddToCartActionProps {
  id: string;
  title: string;
  price: number;
}

export default function AddToCartAction({ id, title, price }: AddToCartActionProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    try {
      addToCart({ id, title, price });
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={adding}
      className="w-full bg-gray-200 text-gray-900 py-4 rounded-lg hover:bg-gray-300 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {adding ? "Adding..." : "Add to Cart"}
    </button>
  );
}