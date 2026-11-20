---
name: slapit-auth-admin
description: "Use when documenting, reusing, extending, or debugging this project's authentication, customer and admin roles, Google OAuth, sign-in reminder, protected admin APIs, product catalog, inventory, orders, and print-job workflows. Also use as a reference template when implementing a similar ecommerce admin system in another app."
---

# Slap It Authentication and Admin System

This skill describes the implementation in this repository and provides a reusable architecture
for porting the same patterns to another ecommerce project. Treat the source code as authoritative:
verify it before changing this document because authentication, prompt timing, and admin workflows
may evolve.

## Current Stack and Main Files

- Client: React, React Router, Zustand, Axios, Google Identity Services via `@react-oauth/google`.
- API: Express, TypeScript, Mongoose, MongoDB, Zod, JWT, bcryptjs, Google `OAuth2Client`.
- Account model: `server/src/models/User.ts`.
- Auth rules and session issuance: `server/src/services/authService.ts`.
- Auth routes/controllers/validation: `server/src/routes/authRoutes.ts`,
  `server/src/controllers/authController.ts`, `server/src/validators/authValidator.ts`.
- API authorization middleware: `server/src/middleware/auth.ts`.
- Client session state and startup validation: `client/src/store/authStore.ts`,
  `client/src/App.tsx`, `client/src/services/api.ts`.
- Sign-in screens and timed storefront prompt: `client/src/components/auth/AuthPage.tsx`,
  `client/src/components/auth/SignInPrompt.tsx`.
- Admin route protection and navigation: `client/src/routes/ProtectedRoute.tsx`,
  `client/src/routes/index.tsx`, `client/src/components/admin/AdminSidebar.tsx`.
- Admin APIs: `server/src/routes/productRoutes.ts`, `server/src/routes/orderRoutes.ts`,
  `server/src/routes/categoryRoutes.ts`, `server/src/routes/uploadRoutes.ts`.

## User and Role Data

MongoDB's `users` collection stores:

- `name`
- normalized, unique `email`
- optional `passwordHash` (excluded from ordinary queries)
- optional unique/sparse `googleId`
- `role`, constrained to `customer` or `admin`, defaulting to `customer`
- Mongoose timestamps

Passwords are hashed with bcryptjs at cost 10 in the User model's save hook. Login compares the
provided password against the hash. Never store or return a raw password or password hash.

Public registration always creates a `customer`; the request cannot choose a role. Admin creation
is a privileged provisioning task, not public registration. This repository's seed script clears
existing users, products, and categories before recreating demo data, including a hard-coded demo
admin credential. **Do not run the seed script against production.** Do not reuse its demo
credential or the development JWT fallback in a deployed environment.

## Sign-In and Session Lifecycle

### Email and password

1. The client submits email and password to `POST /api/auth/login`.
2. The API validates the input with Zod, trims/lowercases the email, loads the hidden password hash,
   and verifies the password.
3. The API returns a signed JWT and a safe user projection (`_id`, name, email, role).
4. The JWT currently expires after seven days.

Customer registration calls `POST /api/auth/register`; it validates name/email and a minimum
six-character password, creates a customer account, and returns a session immediately.

### Google sign-in

1. `GoogleOAuthProvider` wraps the client when `VITE_GOOGLE_CLIENT_ID` is configured.
2. Google returns an ID-token credential to the client. The client sends that credential and an
   explicit `audience` (`customer` or `admin`) to `POST /api/auth/google`.
3. The API verifies the token with Google's library and the server-side `GOOGLE_CLIENT_ID`; it
   requires a Google subject, email, and `email_verified === true`.
4. A matching `googleId` is used first. Otherwise, an existing normalized email can be linked to
   that Google ID only if its role matches the requested audience.
5. A new customer can be created from a verified Google identity. Google sign-in never creates an
   admin: an admin must already exist and match the requested audience/email.
6. The API returns the same kind of seven-day JWT session as password login.

The admin and customer UI uses the same Google credential flow, with the audience supplied by the
screen. A client-side role mismatch logs out and reports the mismatch; the API independently
enforces role matching. Google in the recurring prompt is a normal explicit Google button, not
automatic One Tap.

### Client session persistence

- JWT is kept in `localStorage` as `slapit_auth_token`; the older
  `slapit_admin_token` key is accepted for migration compatibility.
- Axios attaches it as `Authorization: Bearer <token>` on API requests.
- On app startup `checkAuth()` calls `GET /api/auth/me`. A failed check clears both token keys.
- The server verifies the JWT, loads the current User from MongoDB, and attaches that user to the
  request. Authorization checks the current database role rather than trusting a client-supplied
  role.
- Logout removes both token keys and clears client auth state.

### Timed sign-in reminder

`SignInPrompt` is mounted in the storefront layout. It only runs on `/`, `/posters`, and
`/posters/:slug`, waits for auth checking to finish, and does not prompt authenticated visitors.
Dismissal, Escape, or clicking the backdrop closes the dialog and starts another timer. Successful
Google sign-in closes it and navigates to `/account/orders`. Customer login remains available at
`/account/login`; closing the prompt does not block guest browsing or checkout.

The current source sets `PROMPT_DELAY_MS = 20_000` (20 seconds). The interval is a UI constant;
change it deliberately and keep this documentation synchronized. The prompt does not persist a
"dismissed forever" flag in the current implementation.

## Authorization and Route Boundaries

The UI's `ProtectedRoute` is a navigation/UX guard, not the security boundary. The API must enforce
authentication and role checks on every protected endpoint:

- `authenticate`: requires a Bearer JWT, verifies it, and reloads the account.
- `requireAdmin`: permits only a currently stored `admin`.
- `requireCustomer`: permits only a currently stored `customer`.
- `optionalAuthenticate`: allows guest checkout but validates a supplied token and attaches its
  user when present.

Typical Express composition:

```ts
router.get('/admin/resource', authenticate, requireAdmin, controller.getResource);
router.post('/orders', optionalAuthenticate, controller.createOrder);
router.get('/mine', authenticate, requireCustomer, controller.getMyOrders);
```

Never rely only on hidden admin links or React route guards. Do not let a public payload set a
user's role or ownership identifier.

## Admin Features in This Project

### Dashboard

`GET /api/orders/admin/stats` is admin-only. It summarizes revenue (excluding cancelled orders),
order count, product count, and distinct customer emails. The admin dashboard displays these
metrics. Inspect the UI before treating every displayed value as a complete analytics report.

### Product catalog and categories

Admin product operations are protected by `authenticate` + `requireAdmin`:

- Create, edit, delete, publish, and draft products.
- Product fields include name/slug, description, price, category, image URLs, tags, sizes,
  featured flag, and publication status.
- Product and category request payloads are validated with Zod.
- Category list/detail endpoints are public; create/update/delete endpoints are admin-only.

### Product image uploads

`POST /api/upload` requires an admin token and accepts one JPEG, PNG, or WebP up to 5 MiB. The
binary is written to MongoDB GridFS; the product stores the returned API URL, not Base64 image
bytes. `GET /api/upload/files/:id` streams the stored image. When moving this design to another
project, configure durable database storage and preserve private authorization on upload while
serving public product artwork appropriately.

### Inventory

- `GET /api/products/admin/inventory` returns a row per product size, including the on-hand count.
- `PATCH /api/products/admin/:id/inventory` validates a nonnegative integer count and upserts that
  product-size value.
- The UI displays low-stock variants and combines stock with order demand.
- Inventory demand is calculated only from orders whose status is `placed`.
- Demand calculation subtracts copies already marked printed; the inventory UI then accounts for
  on-hand stock when calculating extra prints needed.

### Orders and customer history

- Guest checkout is supported. If an authenticated customer checks out, the API links the order to
  that user's ID; it still accepts the customer/shipping details needed to fulfill it.
- The server reloads products and derives prices, names, sizes, and totals itself. Never trust
  prices or totals supplied by the browser.
- Customer order list/detail endpoints require both authentication and the customer role, and query
  by the authenticated user's ID.
- Admins can list/filter orders, open details, and update status through protected endpoints.
- Supported order progression values are `placed`, `paid`, `printing`, `packed`, `shipped`,
  `delivered`, and `cancelled`. Payment status is a separate field.
- Public order-number tracking exists; keep its response scoped to safe tracking data if extending
  the model or endpoint.

### Print jobs

- Admin print jobs group qualifying order items by product and size, include order references, and
  track cumulative completed quantities.
- Active non-cancelled work and items with retained print tracking/history can appear in the jobs
  list. Completed history remains editable.
- Saving a completed-copy total distributes that count across matching orders in chronological
  order. The API rejects values above the total ordered quantity.
- The inventory demand report is intentionally narrower than print-job history: only `placed`
  orders contribute to current extra-print demand.

### Admin surfaces that are placeholders

The current `/admin/customers`, `/admin/analytics`, and `/admin/settings` screens are informational
placeholders, not full customer-management, reporting, or settings systems. Do not describe them
as implemented capabilities without checking the latest source.

## Reuse This Pattern in Another Ecommerce Project

1. Define a user model with normalized unique email, hidden password hash, optional OAuth subject,
   and a server-controlled role enum.
2. Hash passwords in a single model/service layer; validate registration and login separately.
3. Create distinct customer and admin provisioning policies. Never expose role assignment through
   public registration.
4. Verify OAuth credentials on the server against the configured client audience. Require a
   verified email and an explicit account type; do not let an OAuth login create privileged users.
5. Issue a short, documented signed session and return only a safe user projection.
6. Add a client auth store, startup session validation, centralized Bearer attachment, and clean
   logout/token-expiry handling.
7. Protect frontend routes for usability, then enforce roles again in API middleware.
8. For commerce, keep guest checkout optional but derive product availability, price, totals, and
   ownership on the server.
9. Build admin features as independently guarded API capabilities (catalog, inventory, orders,
   fulfillment), validating every mutation.
10. Add sign-in reminders only as optional UX: scope them to public browsing routes, wait until
    auth status is known, provide a clear dismiss path, avoid blocking guest checkout, and tune the
    repeat interval with user experience in mind.
11. Add tests for password hashing, role mismatch, OAuth verification failures, access-control
    denial, guest checkout, customer-owned order isolation, and admin mutations.
12. Configure production secrets and OAuth origins using environment variables. Never commit
    credentials, demo passwords, production database URIs, or JWT secrets.

Before adapting this skill, inspect the target project's data model, routes, environment
configuration, and UI. Port the architecture, not Slap It's domain names, route paths, product
fields, timing, or demo behavior.
