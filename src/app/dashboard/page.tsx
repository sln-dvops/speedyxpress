import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ParcelList } from "./parcelList";
import { logoutAction } from "../actions/ordering/guest-order/logout";
import { getDetrackStatus } from "../actions/ordering/guest-order/getDetrackStatus";
import { DashboardUI } from "@/components/ordering/DashboardUI";

interface Parcel {
  id: string;
  short_id: string;
  recipient_name: string;
  recipient_address: string;
  recipient_postal_code: string;
  created_at: string;
  weight: number;
  pricing_tier: string;
  delivery_status: string;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: parcels, error } = await supabase
    .from("parcels")
    .select(
      `
      id,
      short_id,
      recipient_name,
      recipient_address,
      recipient_postal_code,
      created_at,
      pricing_tier,
      weight,
      orders!inner (
        short_id
      )
    `,
    )
    .eq("orders.user_id", user.id)
    .eq("orders.status", "paid")

  if (error) {
    throw new Error(error.message);
  }

  const normalizedParcels = parcels.map((p: any) => ({
    id: p.id,
    short_id: p.short_id,
    recipient_name: p.recipient_name,
    recipient_address: p.recipient_address,
    recipient_postal_code: p.recipient_postal_code,
    created_at: p.created_at,
    weight: p.weight,
    pricing_tier: p.pricing_tier,
    order_short_id: p.orders.short_id,
  }));

  const parcelsWithStatus: Parcel[] = await Promise.all(
    (parcels ?? []).map(async (parcel: any) => {
      const detrackStatus = await getDetrackStatus(parcel.short_id);

      return {
        ...parcel,
        delivery_status: detrackStatus?.status ?? "info_received",
      };
    }),
  );

  return (
    <DashboardUI
      user={user}
      parcels={normalizedParcels}
      parcelsWithStatus={parcelsWithStatus}
    />
  );
}
