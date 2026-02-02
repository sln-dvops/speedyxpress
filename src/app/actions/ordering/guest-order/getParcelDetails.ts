"use server";

import { createClient } from "@/utils/supabase/server";
import type { ParcelDimensions } from "@/types/pricing";
import { isShortId } from "@/utils/orderIdUtils";

export async function getParcelDetails(
  parcelIdOrShortId: string
): Promise<{
  parcel: ParcelDimensions & {
    id: string;
    short_id?: string;
    status?: string;
    recipient_name: string;
    recipient_address: string;
    recipient_contact_number: string;
    recipient_email: string;
    pricing_tier: string;
    detrack_job_id?: string;
    created_at: string;
  };
  order: {
    id: string;
    short_id?: string;
    sender_name: string;
    status: string;
    delivery_method: string;
    created_at: string;
  };
} | null> {
  try {
    const supabase = await createClient();

    let query = supabase.from("parcels").select(
      `
        *,
        orders:order_id (
          id,
          short_id,
          sender_name,
          status,
          delivery_method,
          created_at
        )
      `
    );

    if (isShortId(parcelIdOrShortId)) {
      query = query.eq("short_id", parcelIdOrShortId);
    } else {
      query = query.eq("id", parcelIdOrShortId);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      console.error(`Error fetching parcel ${parcelIdOrShortId}:`, error);
      return null;
    }

    const parcel: ParcelDimensions & {
      id: string;
      short_id?: string;
      status?: string;
      recipient_name: string;
      recipient_address: string;
      recipient_contact_number: string;
      recipient_email: string;
      pricing_tier: string;
      detrack_job_id?: string;
      created_at: string;
    } = {
      id: data.id,
      short_id: data.short_id,
      weight: data.weight,

      // dimensions kept only as raw metadata (not pricing)
      length: data.length,
      width: data.width,
      height: data.height,

      status: data.status,
      recipient_name: data.recipient_name,
      recipient_address: data.recipient_address,
      recipient_contact_number: data.recipient_contact_number,
      recipient_email: data.recipient_email,
      pricing_tier: data.pricing_tier,
      detrack_job_id: data.detrack_job_id,
      created_at: data.created_at,
    };

    return {
      parcel,
      order: data.orders,
    };
  } catch (error) {
    console.error("Error getting parcel details:", error);
    return null;
  }
}
