The Digital Archive: Full Stack Engineering Showcase

A high performance, production ready full stack ecosystem designed for a curated digital arcvhive. This project demonstrates a transition to a Service Interface architecture in Go, paired with a modern Next.js 15+ CMS that prioritizes type safety, memory efficency, and sub 100ms response times.
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

CURRENT WORK IN PROGRESS.
[Phase 1] Core Synchronization (Completed)
[x] Database Hardening: Migrate nullable metadata to NOT NULL defaults.

[x] Repository Layer: Refactor PostRepository for zero-pointer string scanning.

[x] API Wrapper: Standardize utils.Response for consistent Data/Meta/Error structures.

[Phase 2] Frontend Intelligence (In Progress)
[x] Zod Integration: Runtime validation for all archival endpoints.

[ ] Auth Persistence: Implement Axios/Fetch interceptors for automated Authorization: Bearer injection.

[ ] Optimistic UI: Transition Like/Comment mutations to TanStack Query for zero-latency feel.

[Phase 3] Advanced Visualization (Upcoming)
[ ] The Spatial Archive: A 3D "Vault" view using React Three Fiber to navigate artifacts in 3D space.

[ ] Real-time Sync: Implement WebSockets in Go for live comment thread updates.

installation & Setup
1. Backend
# Set your DB credentials and JWT Secret
cp .env.example .env 

# Seed the archive taxonomy and test artifacts
psql -d digital_library -f scripts/seed.sql

# Start the API
go run cmd/api/main.go

2. Frontend
cd frontend
npm install
npm run dev

Key Engineering Decisions.
   The Clean Slate Seeding Strategy: Developed a PL/pgSQL loop that utilizes TRUNCATE ... RESTART IDENTITY CASCADE. This allows for a fresh development environment with valid hierarchial data in milleseconds. 

   XSS & Security Hardening: Integrated bluemonday at the service layer rather than the handler. This ensures that even internal data syncs are sanitized before reaching the repository.

   Standardized API Response Wrapper: Designed a unified JSON structure for all endpoints (Data + Meta + Errors) to simplify frontend consumption and ensure consistent error handling.