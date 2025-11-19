import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import AddToCartAction from "@/components/AddToCartAction";

interface Product {
  id: string;
  title: string;
  imageUrl: string | null;
  originalPrice: number;
  salePrice: number;
  discount: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/products/${product.id}`}>
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
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-4">
          {product.originalPrice > product.salePrice && (
            <span className="text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(product.salePrice)}
          </span>
        </div>
        <a
          href={`upi://pay?pa=6397292498@pthdfc&pn=DRS%20Digital&am=${product.salePrice}&cu=INR&tn=Product%20${product.id}`}
          className="block w-full bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 transition font-semibold"
        >
          Pay via UPI
        </a>
        <div className="mt-2">
          <AddToCartAction id={product.id} title={product.title} price={product.salePrice} />
        </div>
      </div>
    </div>
  );
}

