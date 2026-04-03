"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { PaymentMethod } from "../page";
import { useState } from "react";
import { CartItem } from "@/store/cart";

interface BillingInfoProps {
  items: CartItem[];
  grandTotal: number;
  selectedMethod: PaymentMethod;
}

export default function BillingInfo({
  items,
  grandTotal,
  selectedMethod,
}: BillingInfoProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
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

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

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
        You&apos;ll be redirected to complete payment. Powered by PayMongo.
      </p>
    </div>
  );
}
