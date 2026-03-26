"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PaymentPage() {
  const { shortId } = useParams();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPayment = async () => {
      try {
        const res = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shortId }),
        });
        const data = await res.json();

        if (data.qr_code) {
          setQrCode(data.qr_code);
        } else if (data.error) {
          setError(data.error);
          console.error("HitPay error:", data.raw || data.error);
        }

      } catch (err: any) {
        setError(err.message || "Unexpected error while creating payment.");
      } finally {
        setLoading(false);
      }
    };

    createPayment();
  }, [shortId]);

  useEffect(() => {
    if (!qrCode) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/order-status/${shortId}`);
      const data = await res.json();

      if (data.status === "paid") {
        setStatus("paid");
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [shortId, qrCode]);

  if (loading) return <p>Preparing payment...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (status === "paid")
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>
      </div>
    );

  return (
    <div className="text-center">
      <h1 className="text-xl font-semibold mb-4">Scan to Pay</h1>
      {qrCode && <img src={qrCode} alt="PayNow QR" className="mx-auto" />}
      <p className="mt-4 text-gray-500">Waiting for payment confirmation...</p>
    </div>
  );
}