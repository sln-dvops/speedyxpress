"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ParcelSearch } from "./parcelSearch"

interface Parcel {
  id: string
  short_id: string
  recipient_name: string
  recipient_address: string
  recipient_postal_code: string
  created_at: string
  weight: number
  pricing_tier: string
  order_short_id: string
}

export function ParcelList({ parcels }: { parcels: Parcel[] }) {
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
  className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0"
>
  <div>
    <p className="text-sm sm:text-base text-black">
      TRACKING ID:{" "}
      <span className="font-semibold">{parcel.short_id}</span>
    </p>

    <p className="text-xs sm:text-sm text-gray-500">
      Recipient: {parcel.recipient_name}
    </p>

    <p className="text-xs sm:text-sm text-gray-500">
      {parcel.recipient_address}
    </p>
  </div>

  <div className="flex items-center mt-2 sm:mt-0">
    <Link
      href={`/order/${parcel.order_short_id}`}
      className="dashboard-link"
    >
      View Order
    </Link>
  </div>
</div>

        ))}
      </div>
    </>
  )
}
