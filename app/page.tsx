import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    take: 9,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      
      <div className="container mx-auto px-4 py-12">
        {/* Banners Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Banner title="Special Offer - 80% Off" />
          <Banner title="New Arrivals - Check Now" />
          <Banner title="Limited Time Deals" />
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No products available yet. Check back soon!
            </p>
          )}
        </div>

        <div className="text-center">
          <a
            href="/shop"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            View All Products
          </a>
        </div>
      </div>

      <footer className="bg-[#111] text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} DRS Digital. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <a href="/about" className="hover:text-gray-300 transition">About</a>
            <a href="/contact" className="hover:text-gray-300 transition">Contact</a>
            <a href="/privacy" className="hover:text-gray-300 transition">Privacy</a>
            <a href="/terms" className="hover:text-gray-300 transition">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

