"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "../page";

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  color: string;
  bg: string;
  border: string;
}[] = [
  {
    id: "gcash",
    label: "GCash",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-500",
  },
  {
    id: "maya",
    label: "Maya",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-500",
  },
];

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  setSelectedMethod: (method: PaymentMethod) => void;
}

export default function PaymentMethods({
  selectedMethod,
  setSelectedMethod,
}: PaymentMethodsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
      <h2 className="font-semibold text-gray-800">Payment Method</h2>
      <div className="grid grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((method) => {
          const selected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={cn(
                "relative border-2 rounded-xl py-4 flex flex-col items-center gap-2 transition font-medium cursor-pointer",
                selected
                  ? `${method.border} ${method.bg}`
                  : "border-gray-200 hover:border-gray-300 bg-white",
              )}
            >
              <span
                className={cn(
                  "text-lg font-bold",
                  selected ? method.color : "text-gray-600",
                )}
              >
                {method.label}
              </span>
              {selected && (
                <CheckCircle2 className={cn("w-4 h-4", method.color)} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
