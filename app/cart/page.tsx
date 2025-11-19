"use client";

import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { data: session } = useSession();
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!session) {
      router.push("/auth/signin?callbackUrl=/cart");
      return;
    }

    try {
      // For now, checkout with the first item (MVP)
      // In a full implementation, we'd create an order with all cart items
      const firstItem = cart[0];
      
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: firstItem.id, 
          quantity: firstItem.quantity 
        }),
      });

      const data = await response.json();
      
      if (data.success && data.orderId) {
        clearCart(); // Clear cart after creating order
        router.push(`/checkout/${data.orderId}`);
      } else {
        alert("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <a
              href="/shop"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-600">{formatPrice(item.price)} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-lg p-6 h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-4 border-t">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

