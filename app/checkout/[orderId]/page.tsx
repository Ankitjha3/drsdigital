"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { formatPrice } from "@/lib/utils";
import QRCode from "qrcode";
import Image from "next/image";


export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [upiQr, setUpiQr] = useState<string>("");

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/checkout/" + orderId);
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
          const uri = `upi://pay?pa=6397292498@pthdfc&pn=DRS%20Digital&am=${data.order.totalAmount}&cu=INR&tn=Order%20${orderId}`;
          QRCode.toDataURL(uri).then(setUpiQr).catch(() => {});
        } else {
          setError("Order not found");
        }
      })
      .catch(() => {
        setError("Failed to load order");
      });
  }, [session, router, orderId]);

  

  if (!session) {
    return null;
  }

  if (!order && !error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {order && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="font-semibold">{item.product.title}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-xl font-bold mb-3">Pay via UPI (Manual)</h3>
                <p className="text-sm text-gray-600 mb-3">Scan this UPI QR in your UPI app or pay to <span className="font-semibold">6397292498@pthdfc</span>. Amount will be auto-filled.</p>
                {upiQr && (
                  <div className="mx-auto w-48 h-48 relative">
                    <Image src={upiQr} alt="UPI QR" fill className="object-contain" />
                  </div>
                )}
                <div className="mt-3 text-center">
                  <a
                    href={`upi://pay?pa=6397292498@pthdfc&pn=DRS%20Digital&am=${order.totalAmount}&cu=INR&tn=Order%20${orderId}`}
                    className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                  >
                    Open UPI App
                  </a>
                </div>
              </div>

              {order.status !== "pending" && (
                <p className="mt-4 text-center text-gray-500">
                  This order has already been processed.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

