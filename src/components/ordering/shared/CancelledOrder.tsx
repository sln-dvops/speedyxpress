import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CancelledOrderProps {
  orderId: string
}

export function CancelledOrder({ orderId }: CancelledOrderProps) {
  return (
    <div className="w-full px-4 sm:px-6 md:px-0 md:flex md:justify-center">
      <div className="w-full md:max-w-xl">

        <Card className="bg-white border border-gray-100 shadow-sm rounded-xl md:rounded-2xl">

          <CardContent className="p-5 sm:p-6 md:p-8 flex flex-col items-center text-center">

            {/* Icon */}
            <div className="mb-4">
              <XCircle className="h-14 w-14 sm:h-16 sm:w-16 text-red-500" />
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              Payment Cancelled
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              Your order has been saved, but payment was not completed
            </p>

            {/* Order Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6 w-full max-w-sm">
              <p className="text-xs text-gray-400 mb-1">Order Reference</p>
              <p className="text-sm font-medium text-gray-900">
                #{orderId.slice(0, 8)}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-md">
              You can create a new order to complete your delivery. Your previous order details will not be charged.
            </p>

            {/* CTA */}
            <Button
              className="w-full sm:w-auto bg-black hover:bg-black/90 text-yellow-400 px-6 py-2 rounded-lg"
              asChild
            >
              <Link href="/booking">Create New Order</Link>
            </Button>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}