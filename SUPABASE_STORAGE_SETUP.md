# Supabase Storage Setup Guide

## Overview
This portfolio uses Supabase Storage for cloud file storage, allowing uploads of:
- **PDFs**: Up to 20MB (projects, resume, certificates)
- **Images**: Up to 10MB (blog post cover and section images)

It reuses the same Supabase project already configured for this app (`NEXT_PUBLIC_SUPABASE_URL` /
`NEXT_PUBLIC_SUPABASE_ANON_KEY`) — no extra secret keys are required.

## Setup Instructions

### 1. Create the storage bucket and policies
In the Supabase dashboard, open **SQL Editor** and run `supabase/storage_setup.sql` from this repo.
It creates a public `uploads` bucket with read/write policies (matching the same no-separate-auth
model already used by `supabase/schema.sql` for the database tables — access is gated by the admin
panel's secret key sequence, not Supabase auth).

You can also create the bucket manually instead: **Storage** tab → **New bucket** → name it `uploads`
→ toggle **Public bucket** on. If you do it this way, still run the policy statements from
`storage_setup.sql` so uploads are allowed.

### 2. Environment variables
Confirm these are set in your Vercel project (Project Settings → Environment Variables) for
Production and Preview:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon/public key>
```

If your project uses Supabase's newer key naming, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` also works
as a fallback for the anon key.

### 3. Local development
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon/public key>
```

## File Upload Limits

| File Type | Maximum Size | Storage Location |
|-----------|-------------|------------------|
| PDF Files | 20MB | Supabase Storage (`uploads` bucket) |
| Images | 10MB | Supabase Storage (`uploads` bucket) |
| Metadata | N/A | localStorage |

## API Endpoints

- `POST /api/upload` — Uploads a file to the `uploads` bucket and returns its public URL.
  - Validates file size and type.
  - Filenames are prefixed with a timestamp to avoid collisions.

## Troubleshooting

### Upload fails with "Supabase is not configured"
`NEXT_PUBLIC_SUPABASE_URL` and/or the anon key env var are missing. Set them in Vercel and redeploy.

### Upload fails with a bucket/policy error
The `uploads` bucket or its RLS policies haven't been created yet. Run `supabase/storage_setup.sql`
in the Supabase SQL Editor.

### Files not loading after upload
Check that the bucket is marked **Public** — if it's private, `getPublicUrl()` returns a URL that
won't actually resolve without a signed token.
