import {
  Shirt,
  Watch,
  BookOpen,
  Headphones,
  Coffee,
  Backpack,
  type LucideIcon,
} from "lucide-react";

export interface ProductConfig {
  icon: LucideIcon;
  color: string;
  accent: string;
}

export const PRODUCT_CONFIG: Record<string, ProductConfig> = {
  "oversized-hoodie": {
    icon: Shirt,
    color: "bg-stone-100",
    accent: "text-stone-500",
  },
  "canvas-tote": {
    icon: Backpack,
    color: "bg-amber-50",
    accent: "text-amber-500",
  },
  "wireless-earbuds": {
    icon: Headphones,
    color: "bg-blue-50",
    accent: "text-blue-400",
  },
  "leather-watch": {
    icon: Watch,
    color: "bg-rose-50",
    accent: "text-rose-400",
  },
  "notebook-a5": {
    icon: BookOpen,
    color: "bg-green-50",
    accent: "text-green-500",
  },
  "ceramic-mug": {
    icon: Coffee,
    color: "bg-orange-50",
    accent: "text-orange-400",
  },
};

// Fallback for unknown products
export const DEFAULT_CONFIG: ProductConfig = {
  icon: Shirt,
  color: "bg-gray-100",
  accent: "text-gray-400",
};
