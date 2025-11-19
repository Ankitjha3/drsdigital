import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function MyPurchasesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id, status: "completed" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      downloadLinks: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">My Purchases</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">You haven't made any purchases yet.</p>
            <Link
              href="/shop"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Order #{order.id.slice(0, 8)}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatPrice(order.totalAmount)}</p>
                    <p className="text-sm text-green-600 capitalize">{order.status}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Products:</h3>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.product.title}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.downloadLinks.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold mb-3">Downloads:</h3>
                    <div className="space-y-2">
                      {order.downloadLinks.map((link) => (
                        <a
                          key={link.id}
                          href={`/api/download/${link.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition font-semibold text-center"
                        >
                          Download Product
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

