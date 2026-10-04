# MedSlot — Get Your Doctor Fast!

Convinient And Safe doctor appointment booking platform.

## Goal

To provide the fastest, most convenient way for a patient to find and book a doctor's appointment.

## Features

- Escrow-style payment — funds held by the platform, released after service confirmation
- Concurrency-safe appointment booking — no double-booked slots
- Time-bound payment hold with auto-cancel if unpaid within the window
- Payments and refunds tracked as separate, auditable records
- Doctor verification during registration
- Multiple search filters for fast, convenient booking
- Separate patient-facing and doctor-facing interfaces

**Planned for a later version**: in-range/distance-based doctor search.

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

Actively in development. Patient registration, authentication, and profile management are live. Patients can search, filter, and browse verified doctors by name and specialty. Appointment booking and payments are the current focus — see [ROADMAP.md](./ROADMAP.md) for detailed progress.

## License

All rights reserved. This is a personal portfolio project; source is provided for review purposes only.
