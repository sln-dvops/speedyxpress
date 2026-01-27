import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

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
        <h1 className="text-4xl font-extrabold text-black mb-8">
          My Parcels
        </h1>

        {(!parcels || parcels.length === 0) && (
          <div className="bg-white rounded-lg p-8 shadow">
            <p className="text-gray-600">
              You haven’t created any parcels yet.
            </p>
          </div>
        )}

        {parcels && parcels.length > 0 && (
          <div className="space-y-4">
            {parcels.map((parcel) => (
              <div
                key={parcel.id}
                className="bg-white rounded-lg shadow p-6 flex items-center justify-between"
              >
                {/* Left: parcel identity */}
                <div>
                  <p className="font-semibold text-black">
                    Tracking ID: {parcel.short_id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Recipient: {parcel.recipient_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Address: {parcel.recipient_address}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(parcel.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Right: status + actions */}
                <div className="flex items-center gap-6">
                  {/* Accessing delivery_status from the nested order object */}
                  <span className="text-sm font-medium capitalize">
                    {/* {parcel.order?.delivery_status ?? "Processing"} */ "Processing"}
                  </span>

                  <Link
                    href={`/order/${parcel.short_id}`}
                    className="text-black underline font-medium"
                  >
                    Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
