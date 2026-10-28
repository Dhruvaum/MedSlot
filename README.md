# MedSlot — Get Your Doctor Fast!

Convinient And Safe doctor appointment booking platform.

## Goal

To provide the fastest, most convenient way for a patient to find and book a doctor's appointment.

## Features

- Concurrency-safe appointment booking, proven under genuine simultaneous load with an automated stress test — not just assumed safe, actually verified
- Real payment gateway integration (Razorpay) with server-side cryptographic signature verification — a payment is never trusted on the client's word alone
- Time-bound payment hold with automatic release if unpaid within the window, enforced by a background job rather than a one-off check
- Every payment attempt recorded as its own auditable record, including the gateway's own transaction reference number — not collapsed into a single pass/fail flag
- Resume-payment support — a patient can pick up a still-valid, unfinished checkout instead of losing their held slot
- Tiered cancellation refunds — full refund outside a 2-hour window, a smaller penalty inside it — backed by real gateway refund calls, with a background job confirming settlement rather than assuming it
- Real doctor verification — a doctor's dashboard is usable immediately after registering, but they stay invisible in patient search until a Support team member reviews and approves the account.
- Doctor search with specialty, qualification, and consultation-fee filters
- A unified transactions ledger merging payments and refunds into one view
- Separate Patient, Doctor, and Support interfaces, each with their own dashboard

**Coming next**: date-specific availability exceptions (one-off leave days), geolocation/distance-based doctor search.

## Tech Stack

**Backend**: ASP.NET Core Web API (.NET 8 LTS), EF Core, SQL Server, Redis, Hangfire, JWT auth, Serilog, xUnit + Moq, Swagger/OpenAPI

**Frontend**: React + TypeScript + Vite, Tailwind CSS, shadcn/ui + Radix, React Router, Axios, dayjs, Yup

**Database**: SQL Server (local for development, Azure SQL Database for production)

**Deployment**: Azure App Service + Azure SQL, with CI/CD

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the modular monolith structure, concurrency-control approach, and data-access design.

## Getting Started

### Backend

```
cd Backend/MedSlot.Api
dotnet restore
dotnet run
```

Requires a local SQL Server instance with a connection string configured in `appsettings.Development.json` (not committed).

### Frontend

```
cd Frontend
npm install
npm run dev
```

## Try It Out

MedSlot follows real gated onboarding — a doctor who signs up from scratch won't appear in patient search until a Support team member manually reviews and approves the profile, the same way a real healthcare marketplace works. Since that review depends on a person being available, the demo accounts below let you explore every role immediately without waiting on one.

| Role | Username | Password |
|---|---|---|
| Patient | `rohan.mehta` | `Demo@1234` |
| Doctor (already verified) | `dr.ananya.sharma` | `Demo@1234` |
| Support | `medslotsupport` | `admin@123` |

Want to see the real onboarding flow instead? Sign up as a new doctor from scratch — your dashboard is usable immediately, but you won't appear in patient search until approved. As a solo project, approval isn't instant or guaranteed within any particular window.

## Project Status

Actively in development. Patient registration, authentication, and profile management are live. Patients can search and book verified doctors, with concurrency-safe slot locking and a full Razorpay payment flow — including signature-verified confirmation, automatic release of unpaid holds, tiered cancellation refunds, and doctor verification gated behind Support-team review. See [ROADMAP.md](./ROADMAP.md) for detailed progress.

## License

All rights reserved. This is a personal portfolio project; source is provided for review purposes only.
