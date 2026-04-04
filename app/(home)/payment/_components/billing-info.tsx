"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CartItem } from "@/store/cart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "../page";
import { CreditCard, Loader2 } from "lucide-react";

const billingSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters."),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "Phone must be a valid PH number (e.g. 09xxxxxxxxx)."),
  email: z.string().email("Please enter a valid email address."),
});

type BillingFormValues = z.infer<typeof billingSchema>;

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
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BillingFormValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = async (values: BillingFormValues) => {
    setServerError("");

    try {
      const res = await fetch("/api/paymongo/create-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          currency: "PHP",
          type: selectedMethod,
          ...values,
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
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <h2 className="font-semibold text-gray-800">Billing Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Juan Dela Cruz" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="09xxxxxxxxx" {...register("phone")} />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="juan@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-red-500 font-medium">{serverError}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 text-sm bg-blue-600 hover:bg-blue-700 mt-2 cursor-pointer"
        >
          {isSubmitting ? (
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
      </form>
    </div>
  );
}
