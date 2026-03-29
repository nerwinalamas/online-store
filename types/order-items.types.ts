import { Database } from "./supabase";

export type OrderItems = Database["public"]["Tables"]["order_items"]["Row"];
