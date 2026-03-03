Digital Library API (v2)

A clean, production ready Go backend for a curated digital archive. This project implements a high performance discovery engine with a focus on Clean Architecture, relational integrity, and developer experience.

The system follows a strict unidirectional data flow:
   Handler (HTTP) ⮕ Service (Logic) ⮕ Repository (SQL).  
This ensures that business rules (like slug generation or permission checks) are never bypassed and are easily testable.

Recent Updates: The Social & Discovery Layer
   Slug Engine: Automated SEO friendly URL generation with built in collision resolution.
   Public Discovery: Opern routes for browsing, searching and filtering without authentication.
   Relational Comments: Fully integrated social layer with `ON DELETE CASCADE` integrity.

Tech Stack
   Language: GO 1.21+
   Router: Chi (Lightweight & Idiomatic)
   Database: PostgreSQL
   Auth: JWT & Bcrypt
   Security: Bluemonday (HTML Sanitization) & Rate Limiting
   Infrastructure: Docker & Docker Compose

Architecture & Design 
   cmd/: Entry point for server initialization and graceful shutdown logic.

   internal/handlers/: HTTP transport layer; parses JSON and handles status codes.

   internal/service/: The "Brain" of the app; handles complex logic like recursive comment nesting and slug uniqueness.

   internal/repository/: Pure SQL layer; utilizes pg for performance and relational integrity.

   pkg/: Shared utilities (JWT management, password hashing, slug engines).

Key Engineering Decisions
   Threaded Comment Trees: Implemented an `O(n)` tree building algorithm in the service layer to transform flat SQL results into nested JSON replies, avoiding the N+1 database query problem.

   Collision Resistant Slugs: A recursive resolution engine ensures unique SEO friendly URLs (e.g., modern-art becomes modern-art-1 automatically).
   
   Atomic Transactions: Uses `db.Begin()` for post creation to guarantee that the Post Tag relationship is committed as a single unit.
   
   Type Safe Middleware: Utilizes custom ContextKey types to prevent key collisions in the request context and ensure type safe user identity assertions.
   
   Pagination Metadata: Standardized API responses to include total_pages, current_page, and total_items for seamless frontend integration.

API Endpoints
   Authentication:
| Method | Endpoint | Description | Access |
| POST | `/register` | Create a new account | Public |
| POST | `/login` | Get a JWT token | Public |

   Discovery 
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/posts` | List posts (Search, Category, Tag filters) | Public |
| GET | `/posts/s/{slug}`| Fetch a single post by clean URL | Public |
| GET | `/posts/{id}/comments` | View the social feed for a post | Public |

   Interaction
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/upload` | Secure image upload with BlurHash gen | User |
| POST | `/posts` | Create a new entry | Admin |
| POST | `/posts/{id}/like` | Toggle Like/Unlike status | User |
| POST | `/posts/{id}/comments`| Post a new comment | User |

Database Schema
   The system uses a highly relational PostgreSQL schema to minimize redundancy:

   Users: Identity & Role-Based Access Control (RBAC).

   Posts: Core content with blur_hash for progressive image loading.

   Comments: Recursive relationship (parent_id) with ON DELETE CASCADE integrity.

   Tags & Categories: Many-to-Many and One-to-Many relationships for flexible taxonomies.

Quick Start
   Clone & Setup:
   git clone https://github.com/YourUsername/digital-library.git
   cd digital-library
   cp .env.example .env

Launch:
   docker-compose up --build

The server will be available at http://localhost:8080.