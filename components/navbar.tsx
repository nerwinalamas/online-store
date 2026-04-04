"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

const HIDE_CART_ON = ["/cart", "/payment", "/success"];

export default function Navbar() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  const showCart = !HIDE_CART_ON.includes(pathname);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-6xl mx-auto p-2 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:opacity-80 transition"
        >
          Online<span className="text-blue-600">Store</span>
        </Link>

        {showCart ? (
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
        ) : (
          <div className="w-9 h-9" />
        )}
      </div>
    </header>
  );
}
