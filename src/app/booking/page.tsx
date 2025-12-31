import type { Metadata } from "next";
import { OrderFlow } from "@/components/ordering/OrderFlow";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { logoutAction } from "@/app/actions/ordering/guest-order/logout";

export const metadata: Metadata = {
  title: "Speedy Xpress: Create a delivery order",
  description: "Create a one-time delivery order with Speedy Xpress",
};

export default async function OrderPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
const isGuest = !user
  return (
    <>
      <header className="order-header">
  <div className="order-header-inner">
    {user ? (
      <>
        <p className="order-greeting">
          Hi, <span>{user.user_metadata?.display_name}</span>
        </p>

        <div className="order-actions">
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
      <div className="order-actions guest-only">
        <a href="/signup" className="create-account-button">
          Create an account
        </a>
      </div>
    )}
  </div>
</header>


      <main className="order-page-content">
        <OrderFlow />
      </main>
    </>
  );
}
