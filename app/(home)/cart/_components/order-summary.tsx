"use client";

import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";

export default function OrderSummary() {
  const { items, totalPrice } = useCartStore();

  const total = totalPrice();
  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const shipping = total >= 1500 ? 0 : 100;
  const grandTotal = total + shipping;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
      <h2 className="font-semibold text-gray-800">Order Summary</h2>
      <Separator />
      <div className="flex justify-between text-sm text-gray-500">
        <span>Subtotal ({totalItems} items)</span>
        <span>₱{total.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Shipping</span>
        <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
          {shipping === 0 ? "Free" : "₱100"}
        </span>
      </div>
      <Separator />
      <div className="flex justify-between font-bold text-gray-900 text-lg">
        <span>Total</span>
        <span>₱{grandTotal.toLocaleString()}</span>
      </div>
      {shipping > 0 && (
        <p className="text-xs text-gray-400">
          Add ₱{(1500 - total).toLocaleString()} more for free shipping
        </p>
      )}
    </div>
  );
}
