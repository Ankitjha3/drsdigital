"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function EditProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalPrice: "",
    salePrice: "",
    discount: "",
    isActive: true,
  });
  const [imageUrl, setImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if (!session || !session.user.isAdmin) {
      router.push("/");
      return;
    }

    fetch(`/api/admin/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setFormData({
            title: data.product.title,
            description: data.product.description || "",
            originalPrice: data.product.originalPrice.toString(),
            salePrice: data.product.salePrice.toString(),
            discount: data.product.discount.toString(),
            isActive: data.product.isActive,
          });
          setImageUrl(data.product.imageUrl || "");
          setFileUrl(data.product.fileUrl || "");
        }
        setFetching(false);
      })
      .catch(() => {
        setError("Failed to load product");
        setFetching(false);
      });
  }, [session, router, productId]);

  if (!session || !session.user.isAdmin || fetching) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const discount = formData.originalPrice && formData.salePrice
        ? Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.salePrice)) / parseFloat(formData.originalPrice)) * 100)
        : parseInt(formData.discount) || 0;

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          originalPrice: parseFloat(formData.originalPrice),
          salePrice: parseFloat(formData.salePrice),
          discount,
          imageUrl: imageUrl || null,
          fileUrl: fileUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update product");
      } else {
        router.push("/admin/products");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/admin/products"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Products
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">Edit Product</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Original Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Sale Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Product Image
              </label>
              <UploadButton<OurFileRouter>
                endpoint="productImage"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setImageUrl(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  setError(`Image upload failed: ${error.message}`);
                }}
              />
              {imageUrl && (
                <div className="mt-2">
                  <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Digital File (ZIP/PDF)
              </label>
              <UploadButton<OurFileRouter>
                endpoint="productFile"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setFileUrl(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  setError(`File upload failed: ${error.message}`);
                }}
              />
              {fileUrl && (
                <p className="mt-2 text-sm text-green-600">File uploaded successfully</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Product is active
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

