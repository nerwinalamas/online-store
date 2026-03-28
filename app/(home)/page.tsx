"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "./data";

// ─── Types ───────────────────────────────────────────────────────────────────
interface CartState {
  [productId: string]: number;
}

// ─── Cart helpers ─────────────────────────────────────────────────────────────
function loadCart(): CartState {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("cart-qty") || "{}");
  } catch {
    return {};
  }
}

function saveCart(cart: CartState) {
  localStorage.setItem("cart-qty", JSON.stringify(cart));
  const items = PRODUCTS.filter((p) => (cart[p.id] || 0) > 0).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    qty: cart[p.id],
  }));
  localStorage.setItem("cart", JSON.stringify(items));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartState>(loadCart);

  const totalItems = Object.values(cart).reduce((s, q) => s + q, 0);
  const totalPrice = PRODUCTS.reduce(
    (sum, p) => sum + p.price * (cart[p.id] || 0),
    0,
  );

  const updateQty = (productId: string, delta: number) => {
    const product = PRODUCTS.find((p) => p.id === productId)!;
    const current = cart[productId] || 0;
    const next = Math.min(Math.max(current + delta, 0), product.stock);
    const updated = { ...cart, [productId]: next };
    if (next === 0) delete updated[productId];
    setCart(updated);
    saveCart(updated);
  };

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
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
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
            {PRODUCTS.length} items available
          </p>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="max-w-6xl mx-auto px-6 py-10 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => {
            const qty = cart[product.id] || 0;
            const Icon = product.icon;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                {/* Product Image Area */}
                <div
                  className={cn(
                    "relative flex items-center justify-center h-44",
                    product.color,
                  )}
                >
                  <Icon
                    className={cn("w-20 h-20 opacity-25", product.accent)}
                  />
                  {product.badge && (
                    <span
                      className={cn(
                        "absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full",
                        product.badge === "New"
                          ? "bg-blue-600 text-white"
                          : product.badge === "Limited"
                            ? "bg-rose-500 text-white"
                            : "bg-gray-900 text-white",
                      )}
                    >
                      {product.badge}
                    </span>
                  )}
                  {qty > 0 && (
                    <span className="absolute top-3 right-3 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {qty}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        ₱{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {product.stock} left
                      </span>
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => updateQty(product.id, 1)}
                        className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => updateQty(product.id, -1)}
                          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQty(product.id, 1)}
                          disabled={qty >= product.stock}
                          className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Sticky Cart Bar ── */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center px-6 z-20">
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-4 bg-gray-900 text-white rounded-2xl px-6 py-4 shadow-2xl hover:bg-gray-800 transition"
          >
            <span className="w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
            <span className="font-semibold">View Cart</span>
            <span className="text-gray-400">·</span>
            <span className="font-bold">₱{totalPrice.toLocaleString()}</span>
          </button>
        </div>
      )}
    </main>
  );
}
