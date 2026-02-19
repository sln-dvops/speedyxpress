import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { ParcelList } from "./parcelList"
import { logoutAction } from "../actions/ordering/guest-order/logout"
import { getDetrackStatus } from "../actions/ordering/guest-order/getDetrackStatus"

interface Parcel {
  id: string
  short_id: string
  recipient_name: string
  recipient_address: string
  recipient_postal_code: string
  created_at: string
  weight: number
  pricing_tier: string
  delivery_status: string
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

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
  orders!inner (
    short_id
  )
`)
.eq("orders.user_id", user.id)


  if (error) {
    throw new Error(error.message)
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
}))


  const parcelsWithStatus: Parcel[] = await Promise.all(
    (parcels ?? []).map(async (parcel: any) => {
      const detrackStatus = await getDetrackStatus(parcel.short_id)

      return {
        ...parcel,
        delivery_status: detrackStatus?.status ?? "info_received",
      }
    })
  )

  return (
    <div className="min-h-screen bg-yellow-400 py-6 sm:py-12">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 rounded-xl bg-white px-4 py-4 shadow sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h1 className="text-xl sm:text-2xl text-black text-center sm:text-left">My Parcels</h1>

          <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:items-center">
            <a href="/booking" className="dashboard-link">
              Home
            </a>

            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full sm:w-auto rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {parcelsWithStatus.length === 0 && (
          <div className="bg-white rounded-lg p-5 sm:p-8 shadow mx-2 sm:mx-0">
            <p className="text-gray-600">
              You haven’t created any parcels yet.
            </p>
          </div>
        )}

        {parcelsWithStatus.length > 0 && (
          <ParcelList parcels={normalizedParcels} />
        )}
      </div>
    </div>
  )
}
