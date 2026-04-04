"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import PaymentMethods from "./_components/payment-methods";
import PaymentOrderSummary from "./_components/payment-order-summary";
import BillingInfo from "./_components/billing-info";

export type PaymentMethod = "gcash" | "maya";

export default function PaymentPage() {
  const router = useRouter();
  const { items, totalPrice } = useCartStore();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("gcash");

  const total = totalPrice();
  const shipping = total >= 1500 ? 0 : 100;
  const grandTotal = total + shipping;

  return (
    <main className="flex-1 bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold">Payment</h1>
            <p className="text-xs text-gray-400">Complete your order</p>
          </div>
        </div>
      </div>
      <section className="max-w-3xl mx-auto px-6 py-8">
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
