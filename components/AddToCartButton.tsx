"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/products/" + productId);
      return;
    }

    setLoading(true);
    try {
      // Direct checkout flow
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await response.json();
      
      if (data.success && data.orderId) {
        router.push(`/checkout/${data.orderId}`);
      } else {
        alert("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : "BUY NOW"}
    </button>
  );
}

