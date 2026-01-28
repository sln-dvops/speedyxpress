"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push("/")
  }

  const handleForgotPassword = async () => {
  if (!email) {
    setError("Please enter your email first")
    return
  }

  setLoading(true)
  setError(null)

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  setLoading(false)

  if (error) {
    setError(error.message)
  } else {
    setError("Password reset email sent. Check your inbox.")
  }
}

  return (
    <div className="auth-container">
      <div className="logo-wrapper">
        <img src="/images/speedylogo.png" alt="Company Logo" />
      </div>

      <h1>Welcome back</h1>
      <p className="subtitle">Log in to continue</p>

      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p
  className="text-sm text-right cursor-pointer text-gray-600 hover:underline"
  onClick={() => router.push("/forgot-password")}
>
  Forgot password?
</p>



        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="divider" />

      <p className="footer-text">
        New here?{" "}
        <span onClick={() => router.push("/signup")}>
          Create an account
        </span>
      </p>
      <div className="guest-section">
  <button
    type="button"
    className="guest-button"
    onClick={() => router.push("/booking")}
  >
    Continue as guest
  </button>
</div>

    </div>
  )
}
