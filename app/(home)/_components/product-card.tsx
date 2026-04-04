"use client";

import { cn } from "@/lib/utils";
import { PRODUCT_CONFIG, DEFAULT_CONFIG } from "@/config/product-config";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Products } from "@/types/products.types";

interface ProductCardProps {
  product: Products;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem } = useCartStore();

  const qty = items.find((i) => i.id === product.id)?.qty ?? 0;
  const config = PRODUCT_CONFIG[product.id] ?? DEFAULT_CONFIG;
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Product Image Area */}
      <div
        className={cn(
          "relative flex items-center justify-center h-44",
          config.color,
        )}
      >
        <Icon className={cn("w-20 h-20 opacity-25", config.accent)} />
        {product.badge && (
          <span
            className={cn(
              "absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full",
              product.badge === "New"
                ? "bg-blue-600 text-white"
                : product.badge === "Limited"
                  ? "bg-rose-500 text-white"
                  : "bg-gray-900 text-white",
            )}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-base">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              ₱{product.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">{product.stock} left</span>
          </div>

          {qty === 0 ? (
            <Button
              onClick={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  stock: product.stock,
                })
              }
              className="w-full h-10 rounded-xl cursor-pointer bg-blue-600 hover:bg-blue-700 text-sm font-semibold"
            >
              Add to Cart
            </Button>
          ) : (
            <Button
              disabled
              className="w-full h-10 rounded-xl text-sm font-semibold"
            >
              Added
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
