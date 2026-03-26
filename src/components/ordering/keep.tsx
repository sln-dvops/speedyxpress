"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { OrderTypeSelection } from "@/components/ordering/shared/OrderTypeSelection"
import { IndividualOrderFlow } from "@/components/ordering/individual-order/IndividualOrderFlow"
import { BulkOrderFlow } from "@/components/ordering/bulk-order/BulkOrderFlow"
import { logoutAction } from "@/app/actions/ordering/guest-order/logout"

type OrderType = "individual" | "bulk" | null

export function OrderFlow({ user }: { user: any }) {
  const [orderType, setOrderType] = useState<OrderType>(null)

  const handleOrderTypeSelection = (type: OrderType) => {
    setOrderType(type)
  }

  const handleBackToSelection = () => {
    setOrderType(null)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* 🔥 Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold mb-8">Speedy Xpress</h1>

          <nav className="space-y-4 text-sm">
            <a href="/dashboard" className="block hover:text-yellow-400">
              Profile
            </a>
            <a href="/booking" className="block text-yellow-400 font-medium">
              Create New Order
            </a>
            <a href="/dashboard" className="block hover:text-yellow-400">
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

        {!user && (
            <form action={logoutAction}>
            <button className="w-full bg-white text-black py-2 rounded-lg hover:bg-yellow-400 transition">
              Log In / Sign Up
            </button>
          </form>
          )}
        
      </aside>

      {/* 🔥 Main Content */}
      <main className="flex-1 flex flex-col">

        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Create Order</h2>
            {user && (
              <p className="text-sm text-gray-500">
                Welcome back, {user.user_metadata?.display_name ?? "User"}
              </p>
            )}

            {!user && (
              <p className="text-sm text-gray-500">
                Sign up for easier monitoring of your deliveries.
              </p>
            )}
          </div>

        
        </header>

        {/* Content Area */}
        <div className="p-6">

          <AnimatePresence mode="wait">
            {orderType === null && (
              <motion.div
                key="order-type"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OrderTypeSelection onNextStep={handleOrderTypeSelection} />
              </motion.div>
            )}

            {orderType === "individual" && (
              <motion.div
                key="individual-flow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <IndividualOrderFlow onBackToSelection={handleBackToSelection} />
              </motion.div>
            )}

            {orderType === "bulk" && (
              <motion.div
                key="bulk-flow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BulkOrderFlow onBackToSelection={handleBackToSelection} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  )
}