/**
 * Detrack API configuration and utility functions
 */
import { type DetrackConfig, type DetrackJob, DetrackJobType } from "@/types/detrack"
import type { OrderWithParcels } from "@/types/order"

/**
 * Detrack API configuration
 */
export const detrackConfig: DetrackConfig = {
  apiKey: process.env.DETRACK_API_KEY || "",
  apiUrl: process.env.DETRACK_API_URL || "",
  webhookSecret: process.env.DETRACK_WEBHOOK_SECRET,
}

/**
 * Converts our order data to Detrack job format
 */
export function convertOrderToDetrackJob(order: OrderWithParcels): DetrackJob {
  if (!order.orderNumber) {
    throw new Error("Missing orderNumber (tracking ID) for Detrack job")
  }

  const trackingId = order.orderNumber
  const firstParcel = order.parcels[0]

  const job: DetrackJob = {
    type: DetrackJobType.DELIVERY,
    do_number: trackingId,
    date: new Date().toISOString().split("T")[0],
    address: order.recipientAddress,

    order_number: trackingId,
    tracking_number: trackingId,

    deliver_to_collect_from: order.recipientName,
    phone_number: order.recipientContactNumber,
    notify_email: order.recipientEmail,

    address_1: order.recipientLine1,
    address_2: order.recipientLine2 || "",
    postal_code: order.recipientPostalCode,
    city: "Singapore",
    state: "Singapore",
    country: "Singapore",
    zone: order.senderAddress,

    pick_up_from: order.senderName,
    pick_up_address: order.senderAddress,
    pick_up_contact: order.senderContactNumber,
    pick_up_email: order.senderEmail,

    sender_name: order.senderName,
    sender_phone_number: order.senderContactNumber,

    sender_address_1: order.senderAddress,
    sender_address_line_1: order.senderAddress,
    shipper_address: order.senderAddress,
    vendor_address: order.senderAddress,
    from_address: order.senderAddress,
    billing_address: order.senderAddress,

    weight: firstParcel.weight,
    parcel_length: firstParcel.length,
    parcel_width: firstParcel.width,
    parcel_height: firstParcel.height,

    instructions: `Delivery Method: ${
      order.deliveryMethod === "atl" ? "Authorized to Leave" : "Hand to Hand"
    }`,
    service_type: order.deliveryMethod === "atl" ? "Standard" : "Premium",

    webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/detrack/webhook`,
  }

  if (order.parcels.length > 0) {
    job.items = order.parcels.map((parcel, index) => {
      const recipient = order.recipients?.find((r) => r.parcelIndex === index)
      return {
        description: `Parcel ${index + 1}`,
        quantity: 1,
        weight: parcel.weight,
        comments: recipient ? `For: ${recipient.name}` : undefined,
      }
    })
  }

  return job
}


// Add a retry mechanism to the createDetrackHeaders function
export function createDetrackHeaders(): HeadersInit {
  // Check if API key is available
  if (!detrackConfig.apiKey) {
    console.error("Detrack API key is missing or empty")
  }

  return {
    "Content-Type": "application/json",
    "X-API-KEY": detrackConfig.apiKey,
  }
}

// Add a helper function to retry failed API calls
export async function retryDetrackApiCall<T>(apiCall: () => Promise<T>, maxRetries = 3, delayMs = 1000): Promise<T> {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Detrack API call attempt ${attempt}/${maxRetries}`)
      return await apiCall()
    } catch (error) {
      lastError = error
      console.error(`Detrack API call failed (attempt ${attempt}/${maxRetries}):`, error)

      if (attempt < maxRetries) {
        // Wait before retrying (with exponential backoff)
        const backoffDelay = delayMs * Math.pow(2, attempt - 1)
        console.log(`Retrying in ${backoffDelay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, backoffDelay))
      }
    }
  }

  // If we get here, all retries failed
  throw lastError
}
