"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const supabase = createClient()
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push("/login")
  }

  return (
    <div className="auth-container">
      <div className="logo-wrapper">
        <img src="/images/speedylogo.png" alt="Company Logo" />
      </div>
      <h1>Reset password</h1>
      <p className="subtitle">Enter your new password</p>

      <form onSubmit={handleReset} className="auth-form">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  )
}
