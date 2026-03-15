Digital Library API (v5)

A high performance, production ready Go backend for a curated digital archive. This version marks a transition to a Service Interface architecture, prioritizing testability, memory safety, and O(n) performance.

Recent Updates: The Architecture & Performance Hardening:
   1. Service Interface Pattern: 
   Fully decoupled the business logic layer. Handlers now interact with 
   abstractions, allowing for 100% unit test coverage via mocking.

   2. High Performance Slug Engine: 
   Replaced regex heavy logic with a manual single pass strings.Builder implementation, achieving O(n) time complexity with zero extra memory allocations.

   3. Memory Safe Rate Limiting: 
   Implemented a thread safe (Mutex) in memory rate limiter with a background cleanup goroutine to prevent memory leaks from stale IP tracking.

   4. Recursive Comment Trees:
   Developed an efficient map based algorithm to transform flat SQL result sets into deeply nested JSON comment threads in linear time.

   5. Security Hardening:
   JWT v5: Implemented RegisteredClaims (iat, nbf, sub) for auditability.

   XSS Protection: Integrated bluemonday at the service layer for strict HTML sanitization.

   Bcrypt Integrity: Added a 72 byte ceiling check to prevent password truncation issues.

Tech Stack
   Language: Go 1.21+

   Router: Gin Gonic (Optimized for JSON Binding)

   Database: PostgreSQL (Relational Integrity & ACID Transactions)

   Authentication: JWT (HS256) & Bcrypt

   Performance: golang.org/x/time/rate & strings.Builder

   Sanitization: bluemonday (UGC Policy)


Architecture & Design
   1. cmd/api/: Entry point; handles dependency injection and server lifecycle.

   2. internal/handlers/: Transport layer; maps HTTP to service interfaces.

   3. internal/service/: The "Brain"; enforces business rules, slug uniqueness,  
   and sanitization.

   4. internal/repository/: Data access; uses pure SQL with COALESCE for 
   NULL safety.

   5. internal/middleware/: Security layer; manages Auth and Memory Safe Rate 
   Limiting.

   6. pkg/utils/: Shared utilities; optimized for performance and security.

Key Engineering Decisions:
   1. Linear Time Comment Nesting:
   Instead of expensive recursive SQL queries (CTE), all the comments are fetched for a post in one query and build the tree in memory using a hash map. This reduces database load and ensures `O(n)` complexity.

   2. Standardized API Response Wrapper:
   To ensure a consistent Developer Experience (DX) for frontend consumers, every endpoint returns a unified JSON structure:

   3. The "Clean Slate" Seeding Strategy
   `seed.sql` utilizes `TRUNCATE` ... `RESTART` `IDENTITY` `CASCADE` and a PL/pgSQL loop. This allows developers to generate 50+ posts with random categories and valid hierarchical comments in milliseconds for pagination testing.

Environment: cp .env.example .env

Database: Run scripts/seed.sql in your Postgres instance.

Launch: go run cmd/api/main.go

Frontend Architecture (Next.js 16):
The companion frontend is built for speed and discovery, utilizing the latest React patterns to provide a seamless archival browsing experience.

   Framework: Next.js 16 (App Router)

   Styling: Tailwind CSS

   State Management: React Query (TanStack) for synchronized server-state.

   Icons: Lucide React

   Components: Radix UI primitives for accessible modals and dropdowns.

Key Frontend Features:
   1. Optimistic UI: Likes and comments update instantly in the browser before the server confirms, ensuring a "zero latency" feel.

   2. Dynamic Breadcrumbs: Automatically generated paths based on category slugs (e.g., Archive > Manuscripts > Gutenberg).

   3. Responsive Masonry Grid: A custom CSS grid that adapts to different archival asset aspect ratios (Photography vs. Documents).

   4. Skeleton Loading: Custom shimmer effects for a polished "content first" loading experience while the Go backend processes large datasets.

