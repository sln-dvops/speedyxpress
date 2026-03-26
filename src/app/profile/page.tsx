import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { logoutAction } from "../actions/ordering/guest-order/logout"
import ProfileClient from "@/components/ordering/ProfileUI"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <ProfileClient user={user} />
}