"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

export default function SignupSuccessPage() {
  const router = useRouter()
  const supabase = createClient()
  const [checking, setChecking] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setIsLoggedIn(true)
      }
      setChecking(false)
    }

    checkSession()
  }, [])

  const handleContinue = () => {
    if (isLoggedIn) {
      router.push("/dashboard") // or "/booking"
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="auth-container text-center">
      <div className="logo-wrapper">
        <img src="/images/speedylogo.png" alt="Company Logo" />
      </div>

      <h1 className="mt-4">Account created successfully</h1>

      <p className="subtitle mt-2">
        Your account is ready. You can now start creating delivery orders with us.
      </p>

      <button
        onClick={handleContinue}
        className="cursor-pointer w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500 transition"
        disabled={checking}
      >
        {checking ? "Checking..." : "Continue"}
      </button>
    </div>
  )
}