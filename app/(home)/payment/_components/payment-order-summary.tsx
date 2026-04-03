import { PaymentMethod } from "../page";

interface PaymentOrderSummaryProps {
  totalItems: number;
  total: number;
  shipping: number;
  grandTotal: number;
  selectedMethod: PaymentMethod;
}

export default function PaymentOrderSummary({
  totalItems,
  total,
  shipping,
  grandTotal,
  selectedMethod,
}: PaymentOrderSummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
      <h2 className="font-semibold text-gray-800">Order Summary</h2>
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        <span>Subtotal ({totalItems} items)</span>
        <span>₱{total.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Shipping</span>
        <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
          {shipping === 0 ? "Free" : "₱100"}
        </span>
      </div>
      <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
        <span>Total</span>
        <span>₱{grandTotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500 pt-1">
        <span>Method</span>
        <span className="font-medium capitalize">{selectedMethod}</span>
      </div>
    </div>
  );
}
