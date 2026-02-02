import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get("orderId")

  if (!orderId) {
    return NextResponse.redirect(new URL("/booking", req.url))
  }

  const supabase = await createClient()

  // Get first parcel linked to this order
  const { data: parcels, error } = await supabase
    .from("parcels")
    .select("short_id")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true })
    .limit(1)

  if (error || !parcels || parcels.length === 0) {
    console.error("Payment success but no parcel found:", orderId)
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Redirect user to the parcel-based order page
  return NextResponse.redirect(
    new URL(`/order/${parcels[0].short_id}`, req.url)
  )
}
