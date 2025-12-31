import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@/utils/supabase/server"
import { detrackConfig } from "@/config/detrack"

export async function POST(request: NextRequest) {
  try {
    // Get the raw request body
    const rawBody = await request.text()
    console.log("Received Detrack webhook:", rawBody)

    // Parse the JSON body
    let body
    try {
      body = JSON.parse(rawBody)
    } catch (error) {
      console.error("Error parsing webhook body:", error)
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    // Verify the webhook signature if a secret is configured
    if (detrackConfig.webhookSecret) {
      const signature = request.headers.get("X-Detrack-Signature")
      if (!signature) {
        console.error("Missing Detrack signature")
        return NextResponse.json({ error: "Missing signature" }, { status: 401 })
      }

      const expectedSignature = crypto.createHmac("sha256", detrackConfig.webhookSecret).update(rawBody).digest("hex")

      if (signature !== expectedSignature) {
        console.error("Invalid Detrack signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    // Extract the job data
    const { data } = body
    if (!data || !data.do_number) {
      console.error("Invalid webhook payload")
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const orderId = data.do_number
    const status = data.status?.toLowerCase()
    const trackingStatus = data.tracking_status

    console.log(`Processing Detrack update for order ${orderId}: ${status} (${trackingStatus})`)

    // Map Detrack status to our order status
   let deliveryStatus = "processing"

switch (status) {
  case "dispatched":
    deliveryStatus = "picked_up"
    break
  case "in_progress":
    deliveryStatus = "on_the_way"
    break
  case "completed":
    deliveryStatus = "delivered"
    break
  case "failed":
    deliveryStatus = "delivery_failed"
    break
  case "cancelled":
    deliveryStatus = "cancelled"
    break
}

    // Update the order status in our database
    const supabase = await createClient()
    const { error } = await supabase
  .from("orders")
  .update({
    delivery_status: deliveryStatus,
    updated_at: new Date().toISOString(),
  })
  .eq("detrack_job_id", orderId)


    if (error) {
      console.error(`Error updating order ${orderId} status:`, error)
      return NextResponse.json({ error: "Database update failed" }, { status: 500 })
    }

    console.log(`Updated order ${orderId} status to ${deliveryStatus}`)

    // If there are item updates, update the corresponding parcels
    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item.id) {
          const { error: parcelError } = await supabase
            .from("parcels")
            .update({
              updated_at: new Date().toISOString(),
              // Add any parcel-specific status fields here if needed
            })
            .eq("detrack_item_id", item.id)

          if (parcelError) {
            console.error(`Error updating parcel with Detrack item ID ${item.id}:`, parcelError)
          }
        }
      }
    }

    // Return a success response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing Detrack webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

