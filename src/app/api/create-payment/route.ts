import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { shortId, email, name, phone } = await req.json();

    if (!shortId) {
      return new Response(JSON.stringify({ error: "Missing shortId" }), { status: 400 });
    }

    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("amount")
      .eq("short_id", shortId)
      .single();

    if (error || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    if (!process.env.HITPAY_API_KEY) {
      return new Response(JSON.stringify({ error: "HitPay API key not set" }), { status: 500 });
    }

    const body = {
      amount: order.amount,
      currency: "SGD",
      payment_methods: ["paynow_online"],
      email: email || "",
      name: name || "Speedy Xpress Order",
      phone: phone || "",
      reference_number: shortId,
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${shortId}`,
      webhook: `${process.env.NEXT_PUBLIC_BASE_URL}/api/hitpay-webhook`,
      purpose: `Speedy Xpress Delivery - Order ${shortId}`,
      allow_repeated_payments: false,
      send_email: true,
      send_sms: false,
    };

    const response = await fetch("https://api.sandbox.hit-pay.com/v1/payment-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BUSINESS-API-KEY": process.env.HITPAY_API_KEY!,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // HitPay mock mode might not return qr_code
    const qr_code = data.qr_code || data.checkout_url || null;

    if (!qr_code) {
      console.warn("HitPay returned no QR code:", data);
      return new Response(JSON.stringify({ error: "No QR code returned from HitPay", raw: data }), { status: 500 });
    }

    return new Response(JSON.stringify({ qr_code }), { status: 200 });
  } catch (err: any) {
    console.error("Create-payment error:", err);
    return new Response(JSON.stringify({ error: err.message || "Unexpected server error" }), { status: 500 });
  }
}