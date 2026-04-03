"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import CartItems from "./_components/cart-items";
import OrderSummary from "./_components/order-summary";
import CartEmpty from "./_components/cart-empty";

export default function CartPage() {
  const router = useRouter();
  const { items, totalItems } = useCartStore();

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <main className="flex-1 bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold">Your Cart</h1>
            <p className="text-xs text-gray-400">
              {totalItems()} item{totalItems() !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
      <section className="max-w-3xl mx-auto px-6 py-8 space-y-4">
        <CartItems />
        <OrderSummary />
        <Button
          onClick={() => router.push("/payment")}
          className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 rounded-xl"
        >
          Proceed to Payment →
        </Button>
      </section>
    </main>
  );
}
