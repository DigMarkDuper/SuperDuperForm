# Security Audit — SuperDuperForm (daftarsuperduper.vercel.app)
Authorized target; user's own property. Read-only passive audit performed 2026-10-04.
Scope: deployed site + local E:/super-duper-registration source.

## 1. Fingerprint (VERIFIED)
- URL: https://daftarsuperduper.vercel.app/
- Platform: Vercel (Server: Vercel, X-Vercel-Id: sin1::k6, Cache: HIT on /)
- Framework: Next.js (chunk paths confirm App Router / Turbopack build)
- TLS: TLSv1.3, AES-128-GCM, cert *.vercel.app expiry Nov 27 2026

## 2. Header Posture (VERIFIED — all measured)
PRESENT: Strict-Transport-Security (max-age=63072000; includeSubDomains; preload)
MISSING (8): CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy, Cross-Origin-Resource-Policy
Root cause (verified in source): next.config.ts has no headers() block.
Access-Control-Allow-Origin: * — Q: intentional for public static assets? No credentialed private endpoints served; plausible OK, confirm.

## 3. Exposure Probes (VERIFIED — all 404)
/.env, /.git/config, /package.json, /robots.txt, /sitemap.xml, /next.config.js, /vercel.json, /.next/BUILD_ID, /Dockerfile, /.npmrc → all 404. Clean.

## 4. TLS (VERIFIED)
TLSv1.3 | AES-128-GCM-SHA256 | cert *.vercel.app | exp Nov 27 2026.

## 5. Source / Repo Hygiene (VERIFIED)
- .env.local gitignored: git check-ignore exit=0 (ignored)
- No .env.local, service-account.json, private key, or *.json credential committed (verified via remote head 0ac9b88 + API scan)
- Only exposed artifact: write_sheet.js (references file path, not key content)
- Secret values never in source bundle (confirmed: no NEXT_PUBLIC_ credentials; keys only in server .env)

## 6. Auth / Route / AuthZ (VERIFIED reading source)
- Routes: only app/api/register/route.ts (public registration endpoint — correct for form)
- Auth mechanism: none required (public form, not user dashboard) — appropriate
- Input validation: server-side (validate + sanitize + allowed-value checks + max lengths)
- Sanitize: String() + trim + slice + normalizeWA
- Double-submit guard: submitRef + disabled button
- No session/cookie/auth secrets in frontend bundle
- Open questions (not reproduced): Vercel /api/register 500 (likely env vars, see below)

## 7. Most Important Risk (VERIFIED)
Header posture gap — CSP + framing + MIME-sniff + referrer + permissions missing. Single fix: add headers() block in next.config.ts. Not a data-breach vector by itself, but removes defense layers for a public-facing registration page.

## 8. Unverified / Needs User Confirmation
- Vercel function logs for /api/register 500: could be missing env vars (GOOGLE_*) or malformed private key format. Not a code defect (local write verified). Confirm Vercel Dashboard env vars set.
- No rate-limiting / abuse protection implemented (mentioned in requirements, not implemented). Low priority for single-form public endpoint.

## Out of Scope (stated)
- No penetration testing / payload injection attempted (read-only scope respected)
- No auth bypass attempted (no auth on public form; correct)
- No production data mutation performed (only header creation verified locally; sheet has header only)

## Next Action
Add headers() to E:/super-duper-registration/next.config.ts (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy). Redeploy. Confirm Vercel env vars (4) for /api/register fix.
