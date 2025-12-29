// src/app/actions/debug/testSupabase.ts
"use server"

import { createClient } from "@/utils/supabase/server"

export async function testSupabase() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("orders").select("id").limit(1)

  if (error) {
    console.error(error)
    throw new Error("Supabase connection failed")
  }

  return data
}
