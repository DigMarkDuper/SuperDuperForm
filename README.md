# Super Duper Language Center — Registration Frontend

Production-ready registration form for Super Duper Language Center (Yogyakarta).

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v4 (brand theme inline)
- Google Sheets API (service account — server-only)
- Deployed via Vercel

## Brand
- Blue: #034E9E  ·  Yellow: #F9D024  ·  Font: Poppins + Inter
- Assets from `E:/1. Working/2. Super Duper/FINAL ARTWORK/`

## Setup (local)
```bash
npm install
# Copy .env.example to .env.local and fill credentials
cp .env.example .env.local
npm run dev
```

## Required environment (Vercel / local)
| Variable | Value (example) |
|---|---|
| GOOGLE_PROJECT_ID | digmark-dahsboard |
| GOOGLE_CLIENT_EMAIL | admin-55@digmark-dahsboard.iam.gserviceaccount.com |
| GOOGLE_PRIVATE_KEY | Service account private key (full PEM with \n) |
| GOOGLE_SHEET_ID | 1o6FwXrLnSq5n9jeHT34oGPO3iINvKfbJ-AXnO6zcTGg |

> Never commit `.env`, `service-account.json`, or any `*.json` credentials file.

## Google Sheets Setup
1. Open spreadsheet `1o6FwXrLnSq5n9jeHT34oGPO3iINvKfbJ-AXnO6zcTGg`
2. Create sheet named `Registrations`
3. Add header row: `Registration ID | Timestamp | Nama Lengkap | Nama Panggilan | WhatsApp | Email | Tahun Lahir | Domisili | Status | Tujuan Belajar | Level English | Program | Source | Lead Status | Notes`
4. Share with editor access to `admin-55@digmark-dahsboard.iam.gserviceaccount.com`
5. Ensure column A starts at row 2 (API writes to A2:O with INSERT_ROWS)

## Form Flow
- 3 steps: Kenalan → Perjalanan → Program
- Client validation per step; server-side validation + sanitization on POST
- Multi-select goals max 2 (with conditional "Lainnya" text)
- Registration ID: `SDLC-YYYYMMDD-XXXX`
- Prevents double-submission (button disabled + ref guard)

## Security
- Credentials only in server route (`app/api/register/route.ts`)
- No `NEXT_PUBLIC_*` variables for secrets
- Input normalized; allowed values validated; max lengths enforced
- Error messages to user are generic; technical details logged server-side

## Deploy to Vercel
```bash
vercel --prod
# Add Environment Variables in Vercel Dashboard → Project Settings → Environment Variables
```

## Verification Checklist (before production)
- [ ] Form loads on mobile (360px — 430px)
- [ ] All 11 core fields submit correctly
- [ ] Max 2 goals enforced
- [ ] Conditional "Lainnya" fields work
- [ ] Google Sheets receives new row with timestamp + ID
- [ ] `.env` / `service-account.json` not in repo
- [ ] API returns `{ success: true, registrationId }`
- [ ] Success screen displays correct name + ID
