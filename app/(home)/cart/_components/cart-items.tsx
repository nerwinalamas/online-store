"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";

export default function CartItems() {
  const { items, updateQty, removeItem } = useCartStore();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {items.map((item, i) => (
        <div key={item.id}>
          {i > 0 && <Separator />}
          <div className="flex items-center gap-4 px-5 py-4">
            {/* Name & Price */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {item.name}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">
                ₱{item.price.toLocaleString()} each
              </p>
            </div>

            {/* Qty controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.id, -1)}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-semibold text-sm">
                {item.qty}
              </span>
              <button
                onClick={() => updateQty(item.id, 1)}
                disabled={item.qty >= item.stock}
                className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Subtotal */}
            <p className="w-24 text-right font-bold text-gray-900 text-sm">
              ₱{(item.price * item.qty).toLocaleString()}
            </p>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.id)}
              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
