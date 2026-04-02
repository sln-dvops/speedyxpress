"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrderTypeSelection } from "@/components/ordering/shared/OrderTypeSelection";
import { IndividualOrderFlow } from "@/components/ordering/individual-order/IndividualOrderFlow";
import { BulkOrderFlow } from "@/components/ordering/bulk-order/BulkOrderFlow";
import { logoutAction } from "@/app/actions/ordering/guest-order/logout";

type OrderType = "individual" | "bulk" | null;

export function OrderFlow({ user }: { user: any }) {
  const [orderType, setOrderType] = useState<OrderType>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOrderTypeSelection = (type: OrderType) => {
    setOrderType(type);
  };

  const handleBackToSelection = () => {
    setOrderType(null);
  };

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
  {user ? (
    <>
      <a
        href="/profile"
        onClick={() => setIsMenuOpen(false)}
        className="block hover:text-yellow-400"
      >
        Profile
      </a>

      <a
        href="/booking"
        onClick={() => setIsMenuOpen(false)}
        className="block text-yellow-400 font-medium"
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
    </>
  ) : (
    <>
      

      {/* 🔥 Guest CTA */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 text-xs text-gray-200 border border-yellow-400/20">
  <p className="mb-2 font-medium">
    Save time with an account
  </p>
  <p className="mb-3 text-gray-400">
    Track deliveries, view history, and manage all orders in one place.
  </p>
  <a
    href="/login"
    className="inline-block text-black bg-yellow-400 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-yellow-300 transition"
  >
    Create account
  </a>
</div>
    </>
  )}
</nav>
        </div>

        {user ? (
          <form action={logoutAction}>
            <button className="w-full bg-white text-black py-2 rounded-lg hover:bg-yellow-400 transition">
              Logout
            </button>
          </form>
        ) : (
          <a
            href="/login"
            className="w-full text-center bg-white text-black py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            Log In / Sign Up
          </a>
        )}
      </aside>

      {/* 🔥 Overlay (mobile only) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 🔥 Main Content */}
      <main className="flex-1 flex flex-col md:ml-64">
        {/* 🔥 Header */}
        <header className="sticky top-0 z-40 bg-white border-b px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* ☰ Mobile Menu Button */}
            <button
              className="md:hidden text-black text-xl"
              onClick={() => setIsMenuOpen(true)}
            >
              ☰
            </button>

            <div>
              <h2 className="text-lg md:text-xl font-semibold">Create Order</h2>

              {user ? (
                <p className="text-xs md:text-sm text-gray-600">
                  Welcome, {user.user_metadata?.display_name ?? "User"} !
                </p>
              ) : (
                <p className="text-xs md:text-sm text-gray-500">
                  Hi, Guest. Please note down the tracking Ids of your orders for further uses.
                </p>
              )}
            </div>
          </div>
        </header>

        {/* 🔥 Content */}
        <div className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            {orderType === null && (
              <motion.div
                key="order-type"
                className="w-full max-w-[1000px] mx-auto"
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
                className="w-full max-w-[1000px] mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <IndividualOrderFlow
                  onBackToSelection={handleBackToSelection}
                />
              </motion.div>
            )}

            {orderType === "bulk" && (
              <motion.div
                key="bulk-flow"
                className="w-full max-w-[1000px] mx-auto"
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
  );
}
