#!/usr/bin/env node
/**
 * Pings Supabase with a lightweight, real read so the project's free-tier
 * database doesn't auto-pause from inactivity (Supabase pauses free
 * projects after ~7 days with no API activity).
 *
 * Run this on a schedule (see .github/workflows/keep-supabase-alive.yml,
 * which runs it every Monday) or manually:
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/keep-supabase-alive.js
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
  )
  process.exit(1)
}

async function main() {
  const url = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/blog_posts?select=id&limit=1`

  const res = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Supabase responded ${res.status} ${res.statusText}: ${body}`)
  }

  const rows = await res.json()
  console.log(
    `[keep-supabase-alive] OK at ${new Date().toISOString()} — read ${rows.length} row(s) from blog_posts.`
  )
}

main().catch((error) => {
  console.error("[keep-supabase-alive] Failed:", error.message)
  process.exit(1)
})
