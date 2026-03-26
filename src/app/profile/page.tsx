import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { logoutAction } from "../actions/ordering/guest-order/logout"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      {/* 🔥 Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-black text-white flex flex-col justify-between p-6 border-r border-gray-800">
        <div>
          <h1 className="text-2xl font-bold mb-8">Speedy Xpress</h1>

          <nav className="space-y-4 text-sm">
            <a href="/profile" className="block text-yellow-400 font-medium">
              Profile
            </a>
            <a href="/booking" className="block hover:text-yellow-400">
              Create New Order
            </a>
            <a href="/dashboard" className="block hover:text-yellow-400">
              My Orders
            </a>
          </nav>
        </div>

        {user && (
          <form action={logoutAction}>
            <button className="w-full bg-white text-black py-2 rounded-lg hover:bg-yellow-400 transition">
              Logout
            </button>
          </form>
        )}

        {!user && (
          <a
            href="/login"
            className="w-full text-center bg-white text-black py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            Log In / Sign Up
          </a>
        )}
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 flex flex-col bg-gray-50">

  {/* Header */}
  <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b px-8 py-5">
    <h2 className="text-2xl font-semibold text-gray-900">Profile</h2>
    <p className="text-sm text-gray-500">
      Manage your account details
    </p>
  </header>

  {/* Content */}
  <div className="p-8 max-w-4xl w-full">

    {/* Account Info */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Account Information
      </h3>

      <div className="space-y-4 text-sm">

        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-500">Display Name</span>
          <span className="font-medium text-gray-900">
            {user.user_metadata?.display_name ?? "Not set"}
          </span>
        </div>

        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-500">Email</span>
          <span className="font-medium text-gray-900">
            {user.email}
          </span>
        </div>

        <div className="flex justify-between items-center border-b pb-3">
  <span className="text-gray-500">Account Created</span>
  <span className="font-medium text-gray-900">
    {new Date(user.created_at).toLocaleDateString("en-SG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
  </span>
</div>

        

      </div>
    </div>

    {/* Default Sender */}
    {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Default Sender Details
      </h3>

      <p className="text-sm text-gray-500">
        Save your pickup details to speed up future orders.
      </p>

      <div className="mt-4 h-1 w-12 bg-yellow-400 rounded-full" />
    </div> */}

    {/* Account Actions */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Account Actions
      </h3>

      <form action={logoutAction}>
        <button className="bg-black text-white px-5 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition">
          Logout
        </button>
      </form>
    </div>

  </div>
</main>
    </div>
  )
}