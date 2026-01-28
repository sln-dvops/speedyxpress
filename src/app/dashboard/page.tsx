import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ParcelList } from "./parcelList";
import { logoutAction } from "../actions/ordering/guest-order/logout";

// Define types explicitly for order and parcel
interface Order {
  id: string;
  short_id: string;
  amount: number;
  delivery_status: string;
  user_id: string;
}

interface Parcel {
  id: string;
  short_id: string;
  recipient_name: string;
  recipient_address: string;
  recipient_postal_code: string;
  created_at: string;
  weight: number;
  pricing_tier: string;
  order: Order;  // Explicitly typed as an Order
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /**
   * Fetch ALL parcels that belong to orders owned by this user
   * We join orders to:
   * - verify ownership
   * - show order short ID (ODR##########)
   */
  const { data: parcels, error } = await supabase
    .from("parcels")
    .select(`
      id,
      short_id,
      recipient_name,
      recipient_address,
      recipient_postal_code,
      created_at,
      pricing_tier,
      weight,
      order:orders (
        id,
        short_id,
        amount,
        delivery_status,
        user_id
      )
    `)
    .eq("order.user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching parcels:", error);
  }

  return (
    <div className="min-h-screen bg-yellow-400 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 flex items-center justify-between rounded-xl bg-white px-6 py-4 backdrop-blur-md shadow">
  {/* Left side */}
  <h1 className="text-2xl text-black-700">
    My Parcels
  </h1>

  {/* Right side */}
  <div className="flex items-center gap-4">
    <a href="/booking" className="dashboard-link">
                    Home
                  </a>

    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white cursor-pointer hover:bg-red-600 transition"
      >
        Logout
      </button>
    </form>
  </div>
</div>

        

        {(!parcels || parcels.length === 0) && (
          <div className="bg-white rounded-lg p-8 shadow">
            <p className="text-gray-600">
              You haven’t created any parcels yet.
            </p>
          </div>
        )}

        

        {parcels && parcels.length > 0 && (
  <ParcelList parcels={parcels} />
)}

      </div>
    </div>
  );
}
