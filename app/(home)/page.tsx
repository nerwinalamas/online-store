"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import ProductCard from "./_components/product-card";

export default function ShopPage() {
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
          <Button
            className="flex items-center gap-4 bg-gray-900 text-white rounded-2xl px-6 py-4 shadow-2xl hover:bg-gray-800 h-auto"
            asChild
          >
            <Link href="/cart">
              <span className="w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems()}
              </span>
              <span className="font-semibold">View Cart</span>
              <span className="text-gray-400">·</span>
              <span className="font-bold">
                ₱{totalPrice().toLocaleString()}
              </span>
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
}
