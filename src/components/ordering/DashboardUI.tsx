"use client";

import { useState } from "react";
import { ParcelList } from "@/app/dashboard/parcelList";
import { logoutAction } from "@/app/actions/ordering/guest-order/logout";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  User,
} from "lucide-react";
export function DashboardUI({
  user,
  parcels,
  parcelsWithStatus,
}: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* 🔥 Sidebar */}
      {/* 🔥 Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen bg-black text-white p-4 flex flex-col justify-between
        transition-all duration-300 border-r border-gray-800
        ${isCollapsed ? "w-20" : "w-64"}
        transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        {user && (
  <button
    onClick={() => setIsCollapsed(!isCollapsed)}
    className="
      hidden md:flex
      absolute -right-3 top-8
      bg-yellow-400 text-black p-1 rounded-full shadow-lg
      hover:bg-yellow-300 transition
    "
  >
    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
  </button>
)}

        {/* 🔝 Top Section */}
        <div>
          {/* Logo / Title */}
          <h1
            className={`
    font-bold mb-8 transition-all duration-300
    ${isCollapsed ? "text-center text-xs" : "text-2xl"}
  `}
          >
            {isCollapsed ? "Speedy Xpress" : "Speedy Xpress"}
          </h1>

          {/* Navigation */}
          <nav className="space-y-4 text-sm">
            {user ? (
              <>
                {/* Profile */}
                <a
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className={`group relative flex items-center gap-3 hover:text-yellow-400 ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                >
                  <User className="h-5 w-5" />
                  {isCollapsed && (
                    <span
                      className="
      absolute left-full ml-3
      whitespace-nowrap
      bg-gray-900 text-white text-xs px-2 py-1 rounded-md
      opacity-0 translate-x-[-5px]
      group-hover:opacity-100 group-hover:translate-x-0
      transition-all duration-200 pointer-events-none
      shadow-lg
    "
                    >
                      Profile
                      <span className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></span>
                    </span>
                  )}

                  <span
                    className={`transition-all duration-200 ${
                      isCollapsed
                        ? "opacity-0 w-0 overflow-hidden"
                        : "opacity-100 ml-1"
                    }`}
                  >
                    Profile
                  </span>
                </a>

                {/* Booking */}
                <a
                  href="/booking"
                  onClick={() => setIsMenuOpen(false)}
                  className={`group relative flex items-center gap-3 hover:text-yellow-400 ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                >
                  <Package className="h-5 w-5" />
                  {isCollapsed && (
                    <span
                      className="
      absolute left-full ml-3
      whitespace-nowrap
      bg-gray-900 text-white text-xs px-2 py-1 rounded-md
      opacity-0 translate-x-[-5px]
      group-hover:opacity-100 group-hover:translate-x-0
      transition-all duration-200 pointer-events-none
      shadow-lg
    "
                    >
                      Create New Order
                      <span className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></span>
                    </span>
                  )}

                  <span
                    className={`transition-all duration-200${
                      isCollapsed
                        ? "opacity-0 w-0 overflow-hidden"
                        : "opacity-100 ml-1"
                    }`}
                  >
                    Create New Order
                  </span>
                </a>

                {/* Dashboard */}
                <a
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`group relative flex items-center gap-3 text-yellow-400 ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  {isCollapsed && (
                    <span
                      className="
      absolute left-full ml-3
      whitespace-nowrap
      bg-gray-900 text-yellow-400 text-xs px-2 py-1 rounded-md
      opacity-0 translate-x-[-5px]
      group-hover:opacity-100 group-hover:translate-x-0
      transition-all duration-200 pointer-events-none
      shadow-lg
    "
                    >
                      My Orders
                      <span className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></span>
                    </span>
                  )}

                  <span
                    className={`transition-all duration-200 text-yellow-400 font-medium${
                      isCollapsed
                        ? "opacity-0 w-0 overflow-hidden"
                        : "opacity-100 ml-1"
                    }`}
                  >
                    My Orders
                  </span>
                </a>
              </>
            ) : (
              !isCollapsed && (
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 text-xs text-gray-200 border border-yellow-400/20">
                  <p className="mb-2 font-medium">Save time with an account</p>
                  <p className="mb-3 text-gray-400">
                    Track deliveries, view history, and manage all orders.
                  </p>
                  <a
                    href="/login"
                    className="inline-block text-black bg-yellow-400 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-yellow-300 transition"
                  >
                    Create account
                  </a>
                </div>
              )
            )}
          </nav>
        </div>

        {/* 🔻 Bottom Section */}
        <div>
          {user ? (
            <form action={logoutAction}>
              <button className="w-full bg-white text-black py-1 rounded-lg hover:bg-yellow-400 transition text-lg">
                {isCollapsed ? "⎋" : "Logout"}
              </button>
            </form>
          ) : (
            !isCollapsed && (
              <a
                href="/login"
                className="block text-center bg-white text-black py-2 rounded-lg hover:bg-yellow-400 transition text-sm"
              >
                Log In / Sign Up
              </a>
            )
          )}
        </div>
      </aside>

      {/* 🔥 Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 🔥 Main */}
      <main
        className={`
    flex-1 flex flex-col transition-all duration-300
    ${user && isCollapsed ? "md:ml-20" : "md:ml-64"}
  `}
      >

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
                My Orders
              </h2>
              <p className="text-xs md:text-sm text-gray-500">
                Welcome, {user?.user_metadata?.display_name ?? "User"}
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
                className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
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