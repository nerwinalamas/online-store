import { Database } from "./supabase";

export type Products = Database["public"]["Tables"]["products"]["Row"];