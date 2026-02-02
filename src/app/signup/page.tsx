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
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPasswordRules, setShowPasswordRules] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Password validation rules
  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password)
  }

  const allPasswordRulesPassed = Object.values(passwordRules).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const canSubmit = allPasswordRulesPassed && passwordsMatch && !loading

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
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

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setShowPasswordRules(true)}
          required
        />

        {showPasswordRules && (
          <ul className="password-rules">
            <li className={passwordRules.length ? "valid" : ""}>
              At least 8 characters
            </li>
            <li className={passwordRules.uppercase ? "valid" : ""}>
              One uppercase letter
            </li>
            <li className={passwordRules.lowercase ? "valid" : ""}>
              One lowercase letter
            </li>
            <li className={passwordRules.number ? "valid" : ""}>
              One number
            </li>
          </ul>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="error">Passwords do not match</p>
        )}

        <button type="submit" disabled={!canSubmit}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="divider" />

      <p className="footer-text">
        Already have an account?{" "}
        <span onClick={() => router.push("/login")}>Log in</span>
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
