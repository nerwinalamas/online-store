"use client";

import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";

const HIDE_CART_ON = ["/cart", "/payment", "/success"];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  const showCart = !HIDE_CART_ON.includes(pathname);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-xl font-bold tracking-tight hover:opacity-80 transition"
        >
          Online<span className="text-blue-600">Store</span>
        </button>

        {showCart && (
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
        )}
      </div>
    </header>
  );
}
