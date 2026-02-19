import { notFound } from "next/navigation"
import { getParcelDetails } from "@/app/actions/ordering/guest-order/getParcelDetails"
import { getDetrackStatus } from "@/app/actions/ordering/guest-order/getDetrackStatus"

interface PageProps {
  params: {
    id: string
  }
}

export default async function ParcelPage({ params }: PageProps) {
  const { id } = params

  const details = await getParcelDetails(id)

  if (!details) {
    notFound()
  }

  const trackingData = await getDetrackStatus(id)

  return (
    <div className="min-h-screen bg-yellow-400 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-black mb-8">
          Parcel Details
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">
            Parcel Information
          </h2>

          <p><strong>Tracking ID:</strong> {details.parcel.short_id}</p>
          <p><strong>Recipient:</strong> {details.parcel.recipient_name}</p>
          <p><strong>Address:</strong> {details.parcel.recipient_address}</p>
          <p><strong>Weight:</strong> {details.parcel.weight} kg</p>
          <p><strong>Pricing Tier:</strong> {details.parcel.pricing_tier}</p>
          <p><strong>Created At:</strong> {new Date(details.parcel.created_at).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">
            Order Summary
          </h2>

          <p><strong>Order ID:</strong> {details.order.short_id}</p>
          <p><strong>Sender:</strong> {details.order.sender_name}</p>
          <p><strong>Delivery Method:</strong> {details.order.delivery_method}</p>
          <p><strong>Status:</strong> {details.order.status}</p>
          <p><strong>Order Created:</strong> {new Date(details.order.created_at).toLocaleString()}</p>
        </div>

        {trackingData && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4">
              Tracking Status
            </h2>

            <p className="mb-4 font-semibold">
              Current Status: {trackingData.trackingStatus}
            </p>

            <div className="space-y-4">
              {trackingData.milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`h-4 w-4 rounded-full mt-1 ${
                      milestone.status === "completed"
                        ? "bg-green-500"
                        : milestone.status === "current"
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <div>
                    <p className="font-semibold">{milestone.name}</p>
                    <p className="text-sm text-gray-600">
                      {milestone.description}
                    </p>
                    {milestone.timestamp && (
                      <p className="text-xs text-gray-400">
                        {new Date(milestone.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!trackingData && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4">
              Tracking Status
            </h2>
            <p className="text-gray-600">
              Tracking information is not yet available.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
