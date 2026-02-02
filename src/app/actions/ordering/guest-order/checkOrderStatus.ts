"use server"

import { createClient } from "@/utils/supabase/server"

export async function checkOrderStatus(orderIdentifier: string) {
  try {
    const supabase = await createClient()

    // Try short_id first
    let { data, error } = await supabase
      .from("orders")
      .select("status")
      .eq("short_id", orderIdentifier)
      .maybeSingle()

    // If not found, try UUID
    if (!data) {
      const { data: uuidData, error: uuidError } = await supabase
        .from("orders")
        .select("status")
        .eq("id", orderIdentifier)
        .maybeSingle()

      if (uuidError) {
        console.error("Error checking order status by UUID:", uuidError)
        return null
      }

      data = uuidData
    }

    return data?.status
  } catch (error) {
    console.error("Error checking order status:", error)
    return null
  }
}
