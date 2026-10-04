# Final Verification Checklist

## Verified (this session)
- [x] Project built with Next.js 14 + TypeScript + Tailwind v4
- [x] Brand identity applied (Blue #034E9E, Yellow #F9D024, Poppins + Inter)
- [x] Logo and brandmark copied from E:/1. Working/2. Super Duper/FINAL ARTWORK/
- [x] 3-step form renders (Kenalan / Perjalanan / Program)
- [x] Client-side validation per step (required fields, max 2 goals, allowed values)
- [x] Conditional "Lainnya" fields work (status, goals, source)
- [x] Multi-select goals enforced (max 2) with visual button states
- [x] Progress indicator visible and accurate
- [x] Success screen component built; API returns `{success, registrationId}`
- [x] Error handling: generic user message, server-side log, no credential leak
- [x] Double-submission prevented (ref guard + disabled button during load)
- [x] Mobile-first layout verified at ~390px (vision + snapshot)
- [x] Desktop layout works (centered card, readable)
- [x] `.env.example` created; `.gitignore` excludes `.env`, `*.json` secrets
- [x] No Google credentials in frontend, repo, or logs
- [x] API endpoint `/api/register` responds (returns safe error without env — correct behavior)
- [x] Build passes (`npm run build` completes)

## Not verified / Requires user action (cannot complete without credentials/access)
- [ ] Google Service Account (`admin-55@digmark-dahsboard.iam.gserviceaccount.com`) granted **Editor** access to spreadsheet `1o6FwXrLnSq5n9jeHT34oGPO3iINvKfbJ-AXnO6zcTGg`
- [ ] Spreadsheet tab `Registrations` created with header row (see README)
- [ ] Service account private key configured in Vercel env vars (`GOOGLE_PRIVATE_KEY`)
- [ ] All 4 env vars set in Vercel (and local `.env.local`) — `GOOGLE_PROJECT_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`
- [ ] Real end-to-end submission to Google Sheets (blocked: no env keys)
- [ ] Production deployment to Vercel (ready to run after env set)

## Data Storage Rules (verified in code)
- Registration ID format: `SDLC-YYYYMMDD-XXXX`
- Timestamp: `YYYY-MM-DD HH:MM:SS`
- Multiple choices stored as `; ` separated strings (e.g., `Persiapan kerja; Hospitality / Cruise Career`)
- WhatsApp normalized to `62...`
- Internal fields (`Lead Status`, `PIC`, `Follow Up`, `Notes`) not shown to user; default `New`
