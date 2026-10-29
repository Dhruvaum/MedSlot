# MedSlot Roadmap

This roadmap tracks MedSlot's version-scoped progress. It's a living document, updated as milestones complete.

## Legend
- ✅ **Completed**
- 🚧 **In Progress**
- 📅 **Planned**

## v1.0.0 — MVP (In Progress)

Single clinic/tenant, search-and-book by specialty, concurrency-safe booking, real sandbox payments, deployed live.

**Core booking & payments**
- ✅ Backend project scaffolded (ASP.NET Core Web API, .NET 8)
- ✅ Frontend project scaffolded (React + Vite + TypeScript + Tailwind CSS)
- ✅ Database schema & EF Core setup (patient, doctor, appointment, payment all in place)
- ✅ JWT authentication + role-based authorization (Patient / Doctor / SupportAgent)
- ✅ Doctor verification gate — manual review before a doctor is visible to patients
- ✅ Search-and-book flow with multi-filter search (specialty, qualification, consultation fee)
- ✅ Concurrency-safe appointment slot booking, proven with an automated stress test
- ✅ Time-bound payment hold with automatic auto-cancel background job
- ✅ Real payment gateway integration (Razorpay sandbox), server-side signature verification
- ✅ Tiered cancellation refunds (full outside 2hr window, penalty inside it), with a background job confirming real settlement
- ✅ Doctor fund-release bookkeeping (escrow-style tracking; real payout dispersal is a v2 item, see below)
- ✅ Doctor side appointment outcome-marking (Completed / No-Show)
- ✅ Unified transactions ledger (payments + refunds)
- 🚧 Payment gateway webhook handling — signature verification is done, but confirmation is only client-triggered right now; no server-to-server webhook as a reconciliation safety net yet

**Platform / ops**
- ✅ Automated background jobs (Hangfire) — slot generation, unpaid-appointment-hold release, fund-release tracking, refund settlement polling
- ✅ Global exception-handling middleware, with correct status codes (401/403/409) instead of a generic 500
- ✅ Swagger/OpenAPI documentation
- 🚧 Seeded synthetic data (Bogus) — seeder exists but is currently disconnected from startup, not runnable as-is
- 📅 Redis caching for slot-availability reads
- 📅 Serilog structured logging
- 📅 xUnit + Moq test coverage — only one test exists today (the concurrency stress test); broader coverage still needed
- 📅 Deployed to Azure App Service + Azure SQL, with CI/CD — not started; no deployment files or CI workflow exist yet
- 📅 Automated appointment reminder job (notify patient before their appointment)
- 📅 Visible countdown timer during checkout (the hold-expiry mechanism itself already exists server-side and client-side; only the on-screen countdown is missing)
- 📅 Doctor earnings/settlements page (lightweight v1 version showing eligible/released funds; full real payout view depends on v2's Razorpay Route work)

## Future (Post-MVP, unscheduled)

- 📅 Doctor payout dispersal via Razorpay Route (the v2 half of fund-release tracking)
- 📅 `DoctorLeaves` — one-off availability exceptions (sick day/holiday) on top of the recurring weekly template
- 📅 Admin/Support on a separate frontend + subdomain (deliberately not built for v1 — disproportionate for a 2-page admin surface at this scale)
- 📅 In-range / distance-based doctor search
- 📅 Doctor referral network
- 📅 Teleconsultation (video/voice)
- 📅 Multi-tenancy
- 📅 Admin analytics dashboard
- 📅 Rate limiting
- 📅 Gateway / reverse-proxy layer
