"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ParcelSearch } from "./parcelSearch";

interface Parcel {
  id: string;
  short_id: string;
  recipient_name: string;
  recipient_address: string;
  recipient_postal_code: string;
  created_at: string;
  weight: number;
  pricing_tier: string;
  order_short_id: string;
}

export function ParcelList({ parcels }: { parcels: Parcel[] }) {
  const [query, setQuery] = useState("");

  const filteredParcels = useMemo(() => {
    const sorted = [...parcels].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    if (!query) return sorted;

    const q = query.toLowerCase();

    return sorted.filter(
      (p) =>
        p.short_id.toLowerCase().includes(q) ||
        p.recipient_name.toLowerCase().includes(q) ||
        p.recipient_address.toLowerCase().includes(q),
    );
  }, [query, parcels]);

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
      className="bg-white rounded-xl shadow-sm border p-4 sm:p-5 flex flex-col gap-3"
    >
      {/* 🔹 Top Section */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-s text-gray-400">Tracking ID</p>
          <p className="font-semibold text-sm sm:text-base text-black">
            {parcel.short_id}
          </p>
        </div>

        <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
          {parcel.pricing_tier}
        </span>
      </div>

      {/* 🔹 Recipient Info */}
      <div>
        <p className="text-s text-gray-400">Recipient</p>
        <p className="text-sm text-black font-medium">
          {parcel.recipient_name}
        </p>
        <p className="text-sm text-black font-medium">
          {parcel.recipient_address}
        </p>
      </div>

      {/* 🔹 Bottom Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
        
        <p className="text-xs text-gray-400">
          {new Date(parcel.created_at).toLocaleDateString()}
        </p>

        <Link
          href={`/order/${parcel.order_short_id}`}
          className="
            dashboard-link
          "
        >
          View Order
        </Link>
      </div>
    </div>
  ))}
</div>
    </>
  );
}
