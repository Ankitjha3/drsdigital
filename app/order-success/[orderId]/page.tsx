import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function OrderSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId, userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      downloadLinks: true,
    },
  });

  if (!order) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">Order Successful!</h1>
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="font-bold mb-4">Order Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600 capitalize">
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {order.downloadLinks.length > 0 && (
              <div className="mb-6">
                <h2 className="font-bold mb-4">Download Your Products</h2>
                <div className="space-y-2">
                  {order.downloadLinks.map((link) => (
                    <a
                      key={link.id}
                      href={`/api/download/${link.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Download Product
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Link
                href="/my-purchases"
                className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                View My Purchases
              </Link>
              <Link
                href="/shop"
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

