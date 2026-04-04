"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import CartItems from "./_components/cart-items";
import OrderSummary from "./_components/order-summary";
import CartEmpty from "./_components/cart-empty";
import PageHeader from "@/components/page-header";

export default function CartPage() {
  const { items, totalItems } = useCartStore();

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader
        title="Your Cart"
        subtitle={`${totalItems()} item${totalItems() !== 1 ? "s" : ""}`}
        backHref="/"
      />
      <section className="max-w-6xl mx-auto px-6 py-8 space-y-4">
        <CartItems />
        <OrderSummary />
        <Button
          className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer"
          asChild
        >
          <Link href="/payment">Proceed to Payment →</Link>
        </Button>
      </section>
    </main>
  );
}
