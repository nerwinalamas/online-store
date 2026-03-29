"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cart";
import ProductCard from "./_components/product-card";

export default function ShopPage() {
  const router = useRouter();
  const { data: products = [], isLoading, isError } = useProducts();
  const { totalItems, totalPrice } = useCartStore();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">
          Loading products...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-400 text-sm">
          Failed to load products. Please try again.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            Online<span className="text-blue-600">Store</span>
          </h1>
          <button
            onClick={() => router.push("/cart")}
            className="relative p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-100 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-widest mb-2">
            Spring Collection
          </p>
          <h2 className="text-4xl font-bold text-gray-900">
            Shop All Products
          </h2>
          <p className="text-gray-500 mt-2">
            {products.length} items available
          </p>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="max-w-6xl mx-auto px-6 py-10 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Sticky Cart Bar ── */}
      {totalItems() > 0 && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center px-6 z-20">
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-4 bg-gray-900 text-white rounded-2xl px-6 py-4 shadow-2xl hover:bg-gray-800 transition"
          >
            <span className="w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {totalItems()}
            </span>
            <span className="font-semibold">View Cart</span>
            <span className="text-gray-400">·</span>
            <span className="font-bold">₱{totalPrice().toLocaleString()}</span>
          </button>
        </div>
      )}
    </main>
  );
}
