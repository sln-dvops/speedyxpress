import { notFound } from "next/navigation"
import { getOrderDetails } from "@/app/actions/ordering/guest-order/getOrderDetails"
import { OrderPageWrapper } from "@/components/ordering/OrderPageWrapper"

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  const orderDetails = await getOrderDetails(orderId)

  if (!orderDetails) {
    notFound()
  }
return (
  <div className="min-h-screen bg-gray-50 flex flex-col">

    {/* 🔥 Header */}
    <header className="sticky top-0 z-40 bg-white border-b px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
      
      <div>
        <h1 className="text-xl sm:text-xl font-semibold text-gray-900">
          Order Confirmation
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Your order has been successfully created
        </p>
      </div>

      {/* Mobile-friendly CTA */}
      <a
        href="/booking"
        className="dashboard-link
        "
      >
        Back to Ordering Page
      </a>

    </header>

    {/* 🔥 Content */}
    <main className="flex-1 p-2 sm:p-2 md:p-6">

      <div className="max-w-4xl mx-auto">

        {/* Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">

          <OrderPageWrapper
            orderId={orderId}
            initialOrderDetails={orderDetails}
          />

        </div>

      </div>

    </main>
  </div>
)
}