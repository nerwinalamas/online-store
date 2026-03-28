"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
}

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window === "undefined") return [];
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });
    const orderIdRef = useRef<string>(crypto.randomUUID());

    const persist = (updated: CartItem[]) => {
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        // Sync qty map too
        const qtyMap: Record<string, number> = {};
        updated.forEach((i) => (qtyMap[i.id] = i.qty));
        localStorage.setItem("cart-qty", JSON.stringify(qtyMap));
    };

    const updateQty = (id: string, delta: number) => {
        const updated = cart
            .map((item) =>
                item.id === id
                    ? { ...item, qty: Math.max(1, item.qty + delta) }
                    : item,
            )
            .filter((item) => item.qty > 0);
        persist(updated);
    };

    const remove = (id: string) => {
        persist(cart.filter((item) => item.id !== id));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    const handleProceed = () => {
        const orderId = orderIdRef.current;
        localStorage.setItem("orderId", orderId);
        localStorage.setItem("orderTotal", total.toString());
        router.push("/payment");
    };

    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto" />
                    <p className="text-gray-500 font-medium">
                        Your cart is empty
                    </p>
                    <Button variant="outline" onClick={() => router.push("/")}>
                        Go back to shop
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">Your Cart</h1>
                        <p className="text-xs text-gray-400">
                            {totalItems} item{totalItems !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </header>

            <section className="max-w-3xl mx-auto px-6 py-8 space-y-4">
                {/* Items */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {cart.map((item, i) => (
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
                                        className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
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
                                    onClick={() => remove(item.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                    <h2 className="font-semibold text-gray-800">
                        Order Summary
                    </h2>
                    <Separator />
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal ({totalItems} items)</span>
                        <span>₱{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Shipping</span>
                        <span
                            className={
                                total >= 1500
                                    ? "text-green-600 font-medium"
                                    : ""
                            }
                        >
                            {total >= 1500 ? "Free" : "₱100"}
                        </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-gray-900 text-lg">
                        <span>Total</span>
                        <span>
                            ₱
                            {(total >= 1500
                                ? total
                                : total + 100
                            ).toLocaleString()}
                        </span>
                    </div>
                    {total < 1500 && (
                        <p className="text-xs text-gray-400">
                            Add ₱{(1500 - total).toLocaleString()} more for free
                            shipping
                        </p>
                    )}
                </div>

                <Button
                    onClick={handleProceed}
                    className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                    Proceed to Payment →
                </Button>
            </section>
        </main>
    );
}
