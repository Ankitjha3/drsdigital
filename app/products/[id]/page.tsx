import Navbar from "@/components/Navbar";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartAction from "@/components/AddToCartAction";
import QRCode from "qrcode";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id, isActive: true },
  });

  if (!product) {
    notFound();
  }

  const upiUri = `upi://pay?pa=6397292498@pthdfc&pn=DRS%20Digital&am=${product.salePrice}&cu=INR&tn=Product%20${product.id}`;
  const upiQr = await QRCode.toDataURL(upiUri);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
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
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Product Details */}
            <div className="bg-white rounded-lg p-8">
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            
            {product.description && (
              <p className="text-gray-700 mb-6">{product.description}</p>
            )}

            <div className="flex items-center gap-4 mb-6">
              {product.originalPrice > product.salePrice && (
                <span className="text-2xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-4xl font-bold text-green-600">
                {formatPrice(product.salePrice)}
              </span>
            </div>

            <div className="space-y-6">
              <AddToCartAction id={product.id} title={product.title} price={product.salePrice} />

              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold mb-3">Pay via UPI</h2>
                <p className="text-sm text-gray-600 mb-3">Scan this UPI QR or open your UPI app to pay. VPA: <span className="font-semibold">6397292498@pthdfc</span></p>
                <div className="mx-auto w-48 h-48 relative">
                  <Image src={upiQr} alt="UPI QR" fill className="object-contain" />
                </div>
                <div className="mt-4">
                  <a
                    href={upiUri}
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-semibold"
                  >
                    Open UPI App
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

