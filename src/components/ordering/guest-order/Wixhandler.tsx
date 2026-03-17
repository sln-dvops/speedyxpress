// components/ordering/WixRedirectHandler.tsx
"use client";

import { useEffect } from "react";

export default function WixRedirectHandler({ orderId }: { orderId: string }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");

    if (from === "wix") {
      setTimeout(() => {
        window.location.href = `https://www.speedyxpress.co/booking?order=${orderId}`;
      }, 2000);
    }
  }, [orderId]);

  return null;
}