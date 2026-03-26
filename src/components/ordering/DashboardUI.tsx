"use client";

import { useState } from "react";
import { ParcelList } from "@/app/dashboard/parcelList";
import { logoutAction } from "@/app/actions/ordering/guest-order/logout";

export function DashboardUI({
  user,
  parcels,
  parcelsWithStatus,
}: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* 🔥 Sidebar */}
      <aside
  className={`
    fixed top-0 left-0 z-50 h-screen w-64 bg-black text-white p-6 flex flex-col justify-between
    transform transition-transform duration-300
    ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:fixed md:flex border-r border-gray-800
  `}
>
        <div>
          <h1 className="text-2xl font-bold mb-8">Speedy Xpress</h1>

          <nav className="space-y-4 text-sm">
            <a href="/profile" className="block hover:text-yellow-400">
              Profile
            </a>
            <a href="/booking" className="block hover:text-yellow-400">
              Create New Order
            </a>
            <a href="/dashboard" className="block text-yellow-400 font-medium">
              My Orders
            </a>
          </nav>
        </div>

        {user && (
          <form action={logoutAction}>
            <button className="w-full bg-white text-black py-2 rounded-lg hover:bg-yellow-400 transition">
              Logout
            </button>
          </form>
        )}
      </aside>

      {/* 🔥 Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 🔥 Main */}
      <main className="flex-1 flex flex-col md:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b px-4 md:px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">

            {/* ☰ Hamburger */}
            <button
              className="md:hidden text-xl"
              onClick={() => setIsMenuOpen(true)}
            >
              ☰
            </button>

            <div>
              <h2 className="text-lg md:text-xl font-semibold">
                My Parcels
              </h2>
              <p className="text-xs md:text-sm text-gray-500">
                Welcome back, {user?.user_metadata?.display_name ?? "User"}
              </p>
            </div>
          </div>

          <a
            href="/booking"
            className="bg-black text-white px-3 md:px-4 py-2 rounded-lg text-sm"
          >
            + New Order
          </a>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6">
          {parcelsWithStatus.length === 0 ? (
            <div className="bg-white rounded-xl p-6 md:p-8 shadow text-center">
              <p className="text-gray-600 mb-4">
                You haven’t created any parcels yet.
              </p>
              <a
                href="/booking"
                className="inline-block bg-black text-white px-4 py-2 rounded-lg"
              >
                Create your first order
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-3 md:p-4">
              <ParcelList parcels={parcels} />
            </div>
          )}
        </div>

      </main>
    </div>
  );
}