"use client"

import { Search } from "lucide-react"

export function ParcelSearch({
  query,
  setQuery,
}: {
  query: string
  setQuery: (v: string) => void
}) {
  return (
    <div className="relative w-full sm:w-auto">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

      <input
        type="text"
        placeholder="Search parcels…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          w-full sm:w-[400px]
          rounded-full
          shadow
          bg-white
          py-2.5
          pl-10
          pr-4
          text-sm
          text-black
          placeholder-gray-400
          focus:outline-none
          focus:ring-1
          focus:ring-black
        "
      />
    </div>
  )
}
