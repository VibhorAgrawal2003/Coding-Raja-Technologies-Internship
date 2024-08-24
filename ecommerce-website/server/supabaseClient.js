import { createClient } from "@supabase/supabase-js";

let supabase = null;

export const initSupabase = (url, key) => {
    supabase = createClient(url, key);
};

export const getSupabase = () => {
    if (!supabase) {
        throw new Error("Supabase has not been initialized");
    }
    return supabase;
};
