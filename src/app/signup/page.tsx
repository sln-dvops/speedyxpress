"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()

  const [displayName, setDisplayName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          phone: phone,
        },
      },
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
      <h1>Create your account</h1>
      <p className="subtitle">Get started in under a minute</p>

      <form onSubmit={handleSignup} className="auth-form">
        <input
          type="text"
          placeholder="Display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="divider" />

      <p className="footer-text">
        Already have an account?{" "}
        <span onClick={() => router.push("/login")}>Log in</span>
      </p>
    </div>
  )
}
