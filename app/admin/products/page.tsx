import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/DeleteProductButton";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isAdmin) {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">All Products</h1>
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Add New Product
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-square">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  {product.originalPrice > product.salePrice && (
                    <span className="text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xl font-bold text-green-600">
                    {formatPrice(product.salePrice)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition font-semibold"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton productId={product.id} />
                </div>
                <p className="mt-2 text-sm">
                  Status:{" "}
                  <span className={product.isActive ? "text-green-600" : "text-red-600"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products yet</p>
            <Link
              href="/admin/products/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

