"use client"

import { useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

export default function TestAuth() {
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(console.log)
  }, [])

  return null
}
