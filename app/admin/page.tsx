import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isAdmin) {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const completedOrders = await prisma.order.count({ where: { status: "completed" } });
  const pendingOrders = await prisma.order.count({ where: { status: "pending" } });
  const failedOrders = await prisma.order.count({ where: { status: "failed" } });
  const revenueAgg = await prisma.order.aggregate({
    where: { status: "completed" },
    _sum: { totalAmount: true },
  });
  const totalRevenue = revenueAgg._sum.totalAmount || 0;
  const downloadsCount = await prisma.downloadLink.count();

  const topProductGroup = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 1,
  });
  const topProduct =
    topProductGroup.length > 0
      ? await prisma.product.findUnique({ where: { id: topProductGroup[0].productId } })
      : null;

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Add New Product
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold mt-2">{formatPrice(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-3xl font-bold mt-2">{totalOrders}</p>
            <div className="flex gap-2 text-xs mt-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{completedOrders} completed</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{pendingOrders} pending</span>
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded">{failedOrders} failed</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500">Products</p>
            <p className="text-3xl font-bold mt-2">{totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500">Total Downloads</p>
            <p className="text-3xl font-bold mt-2">{downloadsCount}</p>
            {topProduct && (
              <p className="text-xs text-gray-500 mt-2">Top product: {topProduct.title}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Products ({products.length})</h2>
            <div className="space-y-2">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-gray-500">
                      ₹{product.salePrice} {product.isActive ? "✓ Active" : "✗ Inactive"}
                    </p>
                  </div>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
            <Link
              href="/admin/products"
              className="block text-center mt-4 text-blue-600 hover:underline"
            >
              View All Products
            </Link>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Orders ({orders.length})</h2>
            <div className="space-y-2">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{order.user.email}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} item(s) • ₹{order.totalAmount}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {orders.length === 0 && (
              <p className="text-center text-gray-500 py-4">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

