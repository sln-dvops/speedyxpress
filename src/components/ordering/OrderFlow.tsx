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
        <header className="order-header mb-6">
          <div className="order-header-inner flex justify-between items-center">
            {user ? (
              <>
                <p className="order-greeting">
                  Hi, <span>{user.user_metadata?.display_name}</span>
                </p>
                <div className="order-actions flex gap-2">
                  <a href="/dashboard" className="dashboard-link">
                    Dashboard
                  </a>
                  <form action={logoutAction}>
                    <button type="submit" className="logout-button">
                      Logout
                    </button>
                  </form>

                </div>
              </>
            ) : (
              <div className="order-actions guest-only flex gap-2">
                <p className="order-greeting">Welcome to SpeedyXpress.</p>
                <a href="/login" className="create-account-button">
                  Log In
                </a>
                <a href="/signup" className="create-account-button">
                  Create an account
                </a>
              </div>
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
