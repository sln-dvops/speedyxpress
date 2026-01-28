"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function ForgotPasswordPage() {
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSent(true)
  }

  return (
    <div className="auth-container">
        <div className="logo-wrapper">
        <img src="/images/speedylogo.png" alt="Company Logo" />
      </div>
      <h1>Forgot your password?</h1>
      <p className="subtitle">
        Enter your email and we’ll send you a reset link.
      </p>

      {!sent ? (
        <form onSubmit={handleSend} className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg p-4 text-center">
          <p className="text-green-600 font-medium">
            Reset email sent
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Check your inbox and follow the instructions.
          </p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  )
}
