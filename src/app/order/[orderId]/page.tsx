import { notFound } from "next/navigation";
import { getOrderDetails } from "@/app/actions/ordering/guest-order/getOrderDetails";
import { OrderPageWrapper } from "@/components/ordering/OrderPageWrapper";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  // Fetch order details from Supabase
  const orderDetails = await getOrderDetails(orderId);

  // If order not found, show 404
  if (!orderDetails) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-yellow-400 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <header className="mb-6">
          <div className="mb-8 flex items-center justify-between rounded-xl bg-white px-6 py-4 backdrop-blur-md shadow">
            <h1 className="text-2xl text-black-800">Order Confirmation</h1>
            <div className="flex items-center gap-4">
              <a href="/booking" className="dashboard-link">
                Back to Ordering Page
              </a>
              
            </div>
          </div>
        </header>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <OrderPageWrapper
            orderId={orderId}
            initialOrderDetails={orderDetails}
          />
        </div>
      </div>
    </div>
  );
}
