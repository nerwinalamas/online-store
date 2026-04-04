"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import PaymentMethods from "./_components/payment-methods";
import PaymentOrderSummary from "./_components/payment-order-summary";
import BillingInfo from "./_components/billing-info";
import PageHeader from "@/components/page-header";

export type PaymentMethod = "gcash" | "maya";

export default function PaymentPage() {
  const { items, totalPrice } = useCartStore();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("gcash");

  const total = totalPrice();
  const shipping = total >= 1500 ? 0 : 100;
  const grandTotal = total + shipping;

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader
        title="Payment"
        subtitle="Complete your order"
        backHref="/cart"
      />
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <PaymentMethods
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />
            <PaymentOrderSummary
              totalItems={items.length}
              total={total}
              shipping={shipping}
              grandTotal={grandTotal}
              selectedMethod={selectedMethod}
            />
          </div>

          <BillingInfo
            items={items}
            grandTotal={grandTotal}
            selectedMethod={selectedMethod}
          />
        </div>
      </section>
    </main>
  );
}
