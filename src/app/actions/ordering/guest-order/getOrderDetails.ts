"use server";

import { createClient } from "@/utils/supabase/server";
import type { OrderWithParcels, RecipientDetails } from "@/types/order";
import type { ParcelDimensions } from "@/types/pricing";
import { isShortId } from "@/utils/orderIdUtils";

export async function getOrderDetails(
  inputId: string,
): Promise<OrderWithParcels | null> {
  try {
    const supabase = await createClient();

    let orderId: string | null = null;

    /* -------------------------------------------------
       CASE 1: Parcel tracking ID (SPD##########)
       ------------------------------------------------- */
    if (isShortId(inputId)) {
      const { data: parcel } = await supabase
        .from("parcels")
        .select("order_id")
        .eq("short_id", inputId)
        .maybeSingle();

      if (!parcel) return null;
      orderId = parcel.order_id;
    }

    /* -------------------------------------------------
       CASE 2: Try order UUID directly
       ------------------------------------------------- */
    if (!orderId) {
      const { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("id", inputId)
        .maybeSingle();

      if (order) {
        orderId = order.id;
      }
    }

    /* -------------------------------------------------
       CASE 3: Try order short_id
       ------------------------------------------------- */
    if (!orderId) {
      const { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("short_id", inputId)
        .maybeSingle();

      if (order) {
        orderId = order.id;
      }
    }

    if (!orderId) return null;

    /* -------------------------------------------------
   Fetch order
------------------------------------------------- */
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (!order) return null;

    /* -------------------------------------------------
   Fetch parcels
------------------------------------------------- */
    const { data: parcels } = await supabase
      .from("parcels")
      .select("*")
      .eq("order_id", order.id);

    if (!parcels) return null;

    /* -------------------------------------------------
       Fetch bulk order (optional)
       ------------------------------------------------- */
    const { data: bulkOrder } = await supabase
      .from("bulk_orders")
      .select("*")
      .eq("order_id", order.id)
      .maybeSingle();

    /* -------------------------------------------------
       Format parcels
       ------------------------------------------------- */
    const formattedParcels: ParcelDimensions[] = parcels.map((parcel) => ({
      weight: parcel.weight,

      // dimensions retained as raw metadata only
      length: parcel.length ?? undefined,
      width: parcel.width ?? undefined,
      height: parcel.height ?? undefined,

      pricingTier: parcel.pricing_tier,
      id: parcel.id,
      short_id: parcel.short_id,
    }));

    /* -------------------------------------------------
       Format recipients
       ------------------------------------------------- */
    const recipients: RecipientDetails[] = parcels.map((parcel, index) => ({
      name: parcel.recipient_name,
      address: parcel.recipient_address,
      contactNumber: parcel.recipient_contact_number,
      email: parcel.recipient_email,
      line1: parcel.recipient_line1,
      line2: parcel.recipient_line2 || undefined,
      postalCode: parcel.recipient_postal_code,
      parcelIndex: index,
      pricingTier: parcel.pricing_tier,
    }));

    /* -------------------------------------------------
       Construct response
       ------------------------------------------------- */
    const result: OrderWithParcels = {
      orderNumber: order.id,
      shortId: order.short_id,
      senderName: order.sender_name,
      senderAddress: order.sender_address,
      senderContactNumber: order.sender_contact_number,
      senderEmail: order.sender_email,

      recipientName: parcels[0].recipient_name,
      recipientAddress: `${parcels[0].recipient_line1}, ${
        parcels[0].recipient_line2 || ""
      }, Singapore ${parcels[0].recipient_postal_code}`,
      recipientContactNumber: parcels[0].recipient_contact_number,
      recipientEmail: parcels[0].recipient_email,
      recipientLine1: parcels[0].recipient_line1,
      recipientLine2: parcels[0].recipient_line2 || undefined,
      recipientPostalCode: parcels[0].recipient_postal_code,

      parcelSize: parcels[0].parcel_size,
      deliveryMethod: order.delivery_method,
      amount: order.amount,
      status: order.status,
      isBulkOrder: order.is_bulk_order,

      parcels: formattedParcels,
      recipients: order.is_bulk_order ? recipients : undefined,
    };

    // Add bulk order details if applicable
    if (bulkOrder) {
      result.bulkOrder = {
        id: bulkOrder.id,
        totalParcels: bulkOrder.total_parcels,
        totalWeight: bulkOrder.total_weight,
      };
      result.totalParcels = bulkOrder.total_parcels;
      result.totalWeight = bulkOrder.total_weight;
    }

    return result;
  } catch (err) {
    console.error("getOrderDetails error:", err);
    return null;
  }
}
