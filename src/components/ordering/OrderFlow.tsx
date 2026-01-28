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
    <div className="min-h-screen bg-yellow-400">
      <div className="container mx-auto max-w-[1000px] px-4 pt-8">
        {/* Header */}
        <header className="mb-6">
  <div className="mb-8 flex items-center justify-between rounded-xl bg-white px-6 py-4 backdrop-blur-md shadow">
    
    {user ? (
      <>
        {/* Logged-in state */}
        <p className="text-2xl text-black-700">
          Welcome back,{" "}
          <span className="text-2xl text-black-700">
            {user.user_metadata?.display_name ?? "User"}.
          </span>
        </p>

        <div className="flex items-center gap-4">
          <a href="/dashboard" className="dashboard-link">
                    Dashboard
                  </a>

          <form action={logoutAction}>
            <button
              type="submit"
              className="
                rounded-lg bg-black px-4 py-2
                text-sm font-medium text-white
                hover:bg-red-600
                cursor-pointer
              "
            >
              Logout
            </button>
          </form>
        </div>
      </>
    ) : (
      <>
        {/* Guest state */}
        <p className="text-xl text-black-700">
          Welcome to Speedy Express !
          
        </p>

        <div className="flex items-center gap-4">
          <a href="/login" className="dashboard-link">
                    Log In
                  </a>
          <a href="/signup" className="dashboard-link">
                    Create an account
                  </a>
        </div>
      </>
    )}
  </div>
</header>



        {/* Order Flow */}
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
    </div>
  )
}
