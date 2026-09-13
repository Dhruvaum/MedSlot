# Architecture

## Overall approach — Modular Monolith
One ASP.NET Core Web API project, split internally into feature folders — not separate microservices, and not a multi-project Clean/Onion setup either.

## Why not microservices

- Booking and payment need to happen safely together — lock the slot, create the appointment, take the payment, all as one unit. Splitting this across microservices means handling failures between separate services, which is a much harder problem than this project actually needs.
- One single app is simpler to build, test, and run, while still keeping features cleanly separated inside it.
- Docker and Kubernetes (a possible later goal) don't need microservices — a single app can still run in a container and be deployed on Kubernetes just fine.

## Why not full Onion/Clean Architecture

With only a handful of entities and one core domain, splitting into separate Domain/Application/Infrastructure/API projects adds a lot of extra structure for little real benefit here. Feature folders (Controller + Service + Repository together, in one project) give the same clean separation with much less overhead.

## Backend folder structure

```
MedSlot.Api/
  Auth/, Patients/, Doctors/, Appointments/, Payments/   (feature folders: Controller/Service/Repository)
  Data/        (DbContext)
  Models/      (entities)
  Middleware/  (global exception handling)
  BackgroundJobs/ (Hangfire)
MedSlot.Tests/  (xUnit + Moq — kept separate so test-only code never ships in the real API)
```

## Data access — EF Core

- Lets you query the database using C# (LINQ) instead of writing raw SQL everywhere, and catches mistakes at compile time instead of at runtime.
- Schema changes are tracked as versioned "migrations" instead of manual SQL scripts.
- For the one part that truly needs exact control — the concurrency-safe booking logic — raw SQL is used directly through EF Core, not LINQ, since that needs precise locking behavior.
- The schema was written by hand in SQL Server first, then EF Core generated matching C# code from it, so both stay in sync. From here on, schema changes go through migrations.

## Concurrency control

Each appointment slot has a hidden version number that changes every time it's updated. If two people try to book the same slot at once, the second attempt is automatically rejected instead of silently overwriting the first — this is what stops double-booking.

## Authentication

- Uses JWT Authentication. Anything that can change later (like a doctor's verification status) is checked fresh from the database each time, not trusted from the token, so it never shows outdated information.

## Frontend architecture

One single React app, with separate sections for patients and doctors (`/patient/...`, `/doctor/...`) — not two separate apps on different subdomains. Keeps things simple and avoids the extra login complications that come with splitting across subdomains.

## Database environments

SQL Server running locally for development, Azure SQL Database (free tier) for the live version — same schema in both with their respective connection strings in action.
