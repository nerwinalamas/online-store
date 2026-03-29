"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

type PaymentMethod = "gcash" | "maya";

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

export default function PaymentPage() {
  const router = useRouter();
  const { items, totalPrice } = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("gcash");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setHydrated(true);
  }, []);

  const total = totalPrice();
  const shipping = total >= 1500 ? 0 : 100;
  const grandTotal = total + shipping;

  const handlePay = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("Please fill in all billing information.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/paymongo/create-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          currency: "PHP",
          type: selectedMethod,
          name,
          phone,
          email,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment failed. Please try again.");
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  if (!hydrated) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-xl font-bold tracking-tight hover:opacity-80 transition"
          >
            Online<span className="text-blue-600">Store</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold">Payment</h1>
              <p className="text-xs text-gray-400">Complete your order</p>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left — Method + Summary */}
          <div className="space-y-4">
            {/* Payment Method */}
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
                        "relative border-2 rounded-xl py-4 flex flex-col items-center gap-2 transition font-medium",
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

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
              <h2 className="font-semibold text-gray-800">Order Summary</h2>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>
                  Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)
                </span>
                <span>₱{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span
                  className={shipping === 0 ? "text-green-600 font-medium" : ""}
                >
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
          </div>

          {/* Right — Billing Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold text-gray-800">Billing Information</h2>

            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Juan Dela Cruz"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="09xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <Button
              onClick={handlePay}
              disabled={loading}
              className="w-full h-11 text-sm bg-blue-600 hover:bg-blue-700 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₱{grandTotal.toLocaleString()} via{" "}
                  {selectedMethod === "gcash" ? "GCash" : "Maya"}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-400">
              You&apos;ll be redirected to complete payment. Powered by
              PayMongo.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
