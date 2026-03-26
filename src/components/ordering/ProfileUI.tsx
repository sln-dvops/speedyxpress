"use client"

import { useState } from "react"
import { logoutAction } from "@/app/actions/ordering/guest-order/logout"

export default function ProfileClient({ user }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            <a
              href="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="block text-yellow-400 font-medium"
            >
              Profile
            </a>
            <a
              href="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="block hover:text-yellow-400"
            >
              Create New Order
            </a>
            <a
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block hover:text-yellow-400"
            >
              My Orders
            </a>
          </nav>
        </div>

        <form action={logoutAction}>
          <button className="w-full bg-white text-black py-2 rounded-lg hover:bg-yellow-400 transition">
            Logout
          </button>
        </form>
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

        {/* 🔥 Header */}
        <header className="sticky top-0 z-40 bg-white border-b px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">

            {/* ☰ Hamburger */}
            <button
              className="md:hidden text-xl"
              onClick={() => setIsMenuOpen(true)}
            >
              ☰
            </button>

            <div>
              <h2 className="text-lg md:text-2xl font-semibold text-gray-900">
                Profile
              </h2>
              <p className="text-xs md:text-sm text-gray-500">
                Manage your account details
              </p>
            </div>
          </div>
        </header>

        {/* 🔥 Content */}
        <div className="p-4 md:p-8 max-w-4xl w-full">

          {/* Account Info */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-900">
              Account Information
            </h3>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-500">Display Name</span>
                <span className="font-medium text-gray-900 text-right">
                  {user.user_metadata?.display_name ?? "Not set"}
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900 text-right break-all">
                  {user.email}
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-500">Account Created</span>
                <span className="font-medium text-gray-900 text-right">
                  {new Date(user.created_at).toLocaleDateString("en-SG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-900">
              Account Actions
            </h3>

            <form action={logoutAction}>
              <button className="w-full md:w-auto bg-black text-white px-5 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition">
                Logout
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  )
}