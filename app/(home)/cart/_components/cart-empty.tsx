"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartEmpty() {
  const router = useRouter();

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto" />
        <p className="text-gray-500 font-medium">Your cart is empty</p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Go back to shop
        </Button>
      </div>
    </div>
  );
}
