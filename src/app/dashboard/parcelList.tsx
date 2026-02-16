"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ParcelSearch } from "./parcelSearch"

const STATUS_STYLES: Record<
  string,
  { label: string; color: string }
> = {
  info_received: {
    label: "Info Received",
    color: "bg-green-500",
  },
  assigned: {
    label: "Assigned",
    color: "bg-lime-500",
  },
  picked_up: {
    label: "Picked Up",
    color: "bg-yellow-400",
  },
  in_transit: {
    label: "On the Way",
    color: "bg-blue-500",
  },
  delivered: {
    label: "Delivered",
    color: "bg-purple-500",
  },
  failed: {
    label: "Failed",
    color: "bg-red-500",
  },
}


interface Order {
  id: string
  short_id: string
  amount: number
  delivery_status: string
  user_id: string
}

interface Parcel {
  id: string
  short_id: string
  recipient_name: string
  recipient_address: string
  recipient_postal_code: string
  created_at: string
  weight: number
  pricing_tier: string
  order: Order[]
}

export function ParcelList({ parcels }: { parcels: Parcel[] }) {
  // ✅ search state belongs HERE
  const [query, setQuery] = useState("")

  const filteredParcels = useMemo(() => {
    if (!query) return parcels

    const q = query.toLowerCase()

    return parcels.filter(
      (p) =>
        p.short_id.toLowerCase().includes(q) ||
        p.recipient_name.toLowerCase().includes(q) ||
        p.recipient_address.toLowerCase().includes(q)
    )
  }, [query, parcels])

  return (
    <>
      {/* Header row with search on the right */}
      <div className="mb-6 flex justify-end">
        <ParcelSearch query={query} setQuery={setQuery} />
      </div>

      {filteredParcels.length === 0 && (
        <div className="bg-white rounded-lg p-8 shadow">
          <p className="text-gray-600">No parcels match your search.</p>
        </div>
      )}

      <div className="space-y-4">
        {filteredParcels.map((parcel) => (
          <div
            key={parcel.id}
            className="bg-white rounded-lg shadow p-6 flex justify-between"
          >
            <div>
              <p className="text-l text-black-700">
                TRACKING ID: <span className="font-semibold">{parcel.short_id}</span>
              </p>
              <p className="text-sm text-gray-500">
                Recipient: {parcel.recipient_name}
              </p>
              <p className="text-sm text-gray-500">
                {parcel.recipient_address}
              </p>
            </div>

            <div className="flex items-center gap-4">
  {/* Status */}
  {(() => {
    const rawStatus =
  parcel.order[0]?.delivery_status ?? "info_received"

const statusKey = rawStatus.toLowerCase()

const statusStyle =
  STATUS_STYLES[statusKey] ??
  STATUS_STYLES["info_received"]


    return (
      <div className="flex items-center gap-2 text-sm font-medium">
  <span
    className={`h-2.5 w-2.5 rounded-full ${statusStyle.color}`}
  />
  <span>{statusStyle.label}</span>
</div>

    )
  })()}

  {/* Track button */}
  <Link
    href={`/order/${parcel.short_id}`}
    className="dashboard-link"
  >
    Track
  </Link>
</div>

          </div>
        ))}
      </div>
    </>
  )
}
