import { Database } from "./supabase";

export type Orders = Database["public"]["Tables"]["orders"]["Row"];
