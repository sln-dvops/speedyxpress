import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders, error } = await supabase
    .from("orders")

    .select("id, short_id, delivery_status, amount, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <div className="min-h-screen bg-yellow-400 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <h1 className="text-4xl font-extrabold text-black mb-8">My Orders</h1>

        {(!orders || orders.length === 0) && (
          <div className="bg-white rounded-lg p-8 shadow">
            <p className="text-gray-600">You haven’t created any orders yet.</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-black">
                    Order {order.short_id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium capitalize">
                    {order.delivery_status ?? "Processing"}
                  </span>

                  <span className="font-semibold">
                    ${order.amount.toFixed(2)}
                  </span>

                  <Link
                    href={`/order/${order.short_id}`}
                    className="text-black underline font-medium"
                  >
                    View
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
