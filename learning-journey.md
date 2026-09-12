Sign Up
---

Most modern applications or tenant based applications approve sign Up on completion of credentials setup to make overall flow seamless and have less friction for first time users !

You don't need to hit 2 apis, i.e, Sign In after Sign Up seperately ! The Sign Up service always takes care of Sign In automatically and sends back the response of Sign In API itself.

in our case, we are getting role as a key in our response object of register (sign up) service, which is then used by frontend internally to navigate to respective tenant route accordingly.

Password
---

Never save passwords as plain text in your storage, alsways save encrypted password, and use same hashing algorithm to decrypt in future !

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