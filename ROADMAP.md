# MedSlot Roadmap

This roadmap tracks MedSlot's version-scoped progress. It's a living document, updated as milestones complete.

## Legend
- ✅ **Completed**
- 🚧 **In Progress**
- 📅 **Planned**

## v1.0.0 — MVP (In Progress)

Single clinic/tenant, search-and-book by specialty, concurrency-safe booking, real sandbox payments, one background job, deployed live.

- ✅ Backend project scaffolded (ASP.NET Core Web API, .NET 8)
- ✅ Frontend project scaffolded (React + Vite + TypeScript + Tailwind CSS)
- 🚧 Database schema & EF Core setup
- 📅 JWT authentication + role-based authorization (Patient/Doctor)
- 📅 Doctor verification during registration
- 📅 Search-and-book flow (filter by specialty)
- 📅 Concurrency-safe appointment slot booking
- 📅 Time-bound payment hold with auto-cancel
- 📅 Real payment gateway integration (sandbox mode)
- 📅 Escrow-style payment release, separate payment/refund records
- 📅 Automated appointment reminder job (Hangfire)
- 📅 Redis caching for slot-availability reads
- 📅 Global exception-handling middleware + Serilog logging
- 📅 xUnit + Moq test coverage
- 📅 Swagger/OpenAPI documentation
- 📅 Seeded synthetic data (Bogus)
- 📅 Deployed to Azure App Service + Azure SQL, with CI/CD

## Future (Post-MVP, unscheduled)

- 📅 In-range / distance-based doctor search
- 📅 Doctor referral network
- 📅 Teleconsultation (video/voice)
- 📅 Multi-tenancy
- 📅 Admin analytics dashboard
- 📅 Rate limiting
- 📅 Gateway / reverse-proxy layer
