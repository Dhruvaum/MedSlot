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
- Separate patient-facing and doctor-facing interfaces, each with their own dashboard

**Coming next**: appointment cancellation with tiered refunds, doctor verification during registration, additional search filters (specialty/qualification), and in-range/distance-based doctor search.

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

## Project Status

Actively in development. Patient registration, authentication, and profile management are live. Patients can search and book verified doctors, with concurrency-safe slot locking and a full Razorpay payment flow — including signature-verified confirmation and automatic release of unpaid holds. Appointment cancellation/refunds and doctor verification are the current focus — see [ROADMAP.md](./ROADMAP.md) for detailed progress.

## License

All rights reserved. This is a personal portfolio project; source is provided for review purposes only.
