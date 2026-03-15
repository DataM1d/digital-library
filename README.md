The Digital Archive: Full Stack Engineering Showcase

A high performance, production ready full stack ecosystem designed for a curated digital arcvhive. This project demonstrates a transition to a Service Interface architecture in Go, paired with a modern Next.js16 CMS that prioritizes type safety, memory efficency, and sub 100ms response times.
The project follows a Clean Architecture approach to ensure the business logic is independent of external frameworks.

Engineering Highlight.
   1. High Performance Slug Engine (Go).
   Replaced expensive regex heavy logic with a manual single pass `strings.Builder` implementation.
      Impact: Achieved O(n) time complexity with zero extra heap allocations during string manipulation.

      Why: Drastically reduces GC pressure in high traffic write scenarios.

   2. Linear Time Recursive Comment Trees.
   Developed an efficient map based algorithm to transform flat SQL result sets into deeply nested JSON comment threads. 
      Impact: Avoided expensive Recursive CTEs in SQL. By building the tree in memory using a hash map,  i reduced database overhead from O(n2) to 
      O(n).

      Algorithm: One database trip -> Map pointer assigment -> Nested JSON output.

   3. Memory Safe Rate Limiting.
   Implemented a thread safe `sync.Mutex` in memory rate limiter with a background cleanup goroutine.
      Impact: Prevents memory leaks by automatically pruning stale IP tracking entries after a specified TTL.

      Security: Protects critical Archive endpoints without the overhead of Redis for single node deployments.

   4. Advanced Frontend Data Flow (Next.js).
   Implemented a robust Handshake between the Go API and React.
      Type Safety: Integrated Zod at the network layer to validate API responses against TypeScript interfaces at runtime.

      Optimistic UI: Leveraged React state to provide instant feedback on Likes and Comments, synchronizing with the backend in the background to ensure a zero latency feel.

Tech Stack.
Backend (Go 1.22+)
   Framework: Gin Gonic (optimized with custom JSON binding)
   Architecture: Service Repository Pattern (fully decoupled for unit testing)
   Security: JWT v5 (REgisteredClaims), bluemonday (UGC sanitization), Bcrypt(truncation safe)
   Database: PostgreSQL (Atomic ACID transactions with COALAESCE for NULL safety)

Frontend (Next.js 16)
   Core: App Router, Server Actions and custom Hooks
   State/Validation: TanStack Query & Zod.
   UI/UX: Tailwind CSS, Framer Motion, Lucide, react-dropzone
   Media: Custom Image Fallback systemn with blurHash support

installation & Setup
1. Backend
cp .env.example .env (Set your DB credentials and JWT Secret)

Run scripts/seed.sql to generate the archive taxonomy and 50+ test artifacts.

go run cmd/api/main.go

2. Frontend
cd frontend && npm install

npm run dev

Access at http://localhost:3000

Key Engineering Decisions.
   The Clean Slate Seeding Strategy: Developed a PL/pgSQL loop that utilizes TRUNCATE ... RESTART IDENTITY CASCADE. This allows for a fresh development environment with valid hierarchial data in milleseconds. 

   XSS & Security Hardening: Integrated bluemonday at the service layer rather than the handler. This ensures that even internal data syncs are sanitized before reaching the repository.

   Standardized API Response Wrapper: Designed a unified JSON structure for all endpoints (Data + Meta + Errors) to simplify frontend consumption and ensure consistent error handling.