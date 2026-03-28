"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId") || "";

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-5 max-w-sm px-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">
          Payment Successful!
        </h1>
        <p className="text-gray-500">
          Thank you for your order. We&apos;ve received your payment and will process
          your order shortly.
        </p>
        {orderId && (
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400">Order Reference</p>
            <p className="font-mono font-semibold text-sm text-gray-700 mt-1">
              {orderId}
            </p>
          </div>
        )}
        <Button
          onClick={() => {
            localStorage.removeItem("cart");
            localStorage.removeItem("orderId");
            localStorage.removeItem("orderTotal");
            router.push("/");
          }}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Back to Shop
        </Button>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
