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
    <div className="relative flex items-center">
      {/* Icon */}
      <Search
        className="absolute left-3 h-4 w-4 text-gray-500"
      />

      {/* Input */}
      <input
        type="text"
        placeholder="Search parcels…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          w-[400px]                 /* control width here */
          rounded-full
          shadow
          bg-white
          py-2.5
          pl-10                     /* space for icon */
          pr-4
          text-sm                   /* font size */
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
