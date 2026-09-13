# General Learning

Sign Up
---

Most modern applications or tenant based applications approve sign Up on completion of credentials setup to make overall flow seamless and have less friction for first time users !

You don't need to hit 2 apis, i.e, Sign In after Sign Up seperately ! The Sign Up service always takes care of Sign In automatically and sends back the response of Sign In API itself.

in our case, we are getting role as a key in our response object of register (sign up) service, which is then used by frontend internally to navigate to respective tenant route accordingly.

Password
---

Never save passwords as plain text in your storage, alsways save encrypted password, and use same hashing algorithm to decrypt in future that you used to encrypt it!

The response of any API should not contain `password` at all, this increases the risk of account theft or leakage drastically

Credentials And Tokens
---

Credentials And Tokens never travel in a URL.

Query params get written to browser history, server access logs, and proxy logs — and it's avoided entirely by keeping everything in the request/response body or headers.

Whenever frontend gets an authToken from the response of account specific service during sign up or sign in, the authToken is recommended to be stored in httpOnly cookie as it is immune to XSS token theft.
Or otherwise i do store it under localstorage

TenantId Visibility In URL
---

Don't put the user's own ID in their own URLs.

Example:
    The backend already knows who's calling from the JWT (Authorization header) — putting your own ID in the URL is redundant and opens an unnecessary IDOR surface (someone tries swapping the GUID to see if authorization is enforced everywhere). Real apps don't route their own dashboard as `/users/{my-id}` — that pattern is reserved for viewing someone else's resource (e.g., a patient viewing `/doctor/{doctorId}` to see a specific doctor's public profile — that's a legitimate use of ID-in-URL).

So, it's always like:
`/complete-registration` and `/patient/dashboard` / `/doctor/dashboard`, no ID, identity comes from the token.

# Developmental Learning

1. DbContext is a session, not the data itself. It uses your entity classes (the blueprint/shape) to fetch real rows and map them into real objects — the database stays the actual source of truth.

2. LINQ is a general C# feature, not EF-specific. EF Core just translates the same `.Where()/.FirstOrDefault()` syntax into real SQL when run against a DbSet.

3. EF Core vs. Dapper: EF Core auto-generates SQL from LINQ and auto-tracks changes for `SaveChanges();` Dapper needs hand-written SQL for both reads and writes. EF Core still allows raw SQL when needed — not either/or.

4. Relationship cardinality comes from the database, not your intent. EF Core scaffolded one-to-many until you added a UNIQUE constraint — your mental model alone doesn't make it one-to-one.

5. `builder.Services` is a "recipe book" — register how to build something once, and anything that asks for it later gets it automatically, no manual new.

6. `builder.Configuration` loads appsettings.json then `appsettings.{Environment}.json`, the second overriding the first — environment name comes from `ASPNETCORE_ENVIRONMENT`, set to "Development" locally via `launchSettings.json`.

7. A connection string is only sensitive if it holds a real credential. `Trusted_Connection=True` has none — safe in source, unlike a password-bearing Azure SQL string.

8. Scaffold from the existing database, don't hand-write entities, when the DB already exists — avoids drift between your SQL and your C# model.

9. partial classes protect custom code during re-scaffolding — regenerate the generated file freely, anything you add stays in a separate file untouched.

10. OnConfiguring in `MedSlotDbContext` is a fallback, not the primary config path. DI (Program.cs + appsettings) is the real source; guard it with IsConfigured so it never overrides DI.

11. Never return EF Core entities directly from an API endpoint — map to a DTO first. Entities carry navigation properties that serialize as noisy/misleading data (like "users": [] meaning "not loaded," not "empty") and can even crash with circular-reference errors. DTOs also survive re-scaffolding, since entity classes get overwritten every time we regenerate them.