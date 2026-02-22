Phase 1: The Foundation 2026-02-19

1. Project initialization & Go Modules
    What: Ran go mod init github.com/DataM1d/digital-library.

    Why: Unlike JavaScript which uses npm and package.json, Go uses Modules. This file tracks your dependencies and defines the 'import path' for your internal packages.

    Lesson: Dont run this in your User Home directory! It must be in a dedicated project folder so Go knows exactly where the project boundaries are.

2. Standard Go Project Layout
    What: Created folders like /cmd, /internal, and /pkg.
    
    Why: Go is very flexible,  but the community follows a 'Standard Layout'.
    
    cmd/: Entry points the main.go that starts the app.

    internal/: Private code. Other people's projects can't import this. This is where the 'meat of the app (Business logic, DB queries) lives.

    pkg/: Public/Helper code, Logic that could be reused elswhere (like DB connection setup).

    React Comparison: This is like separating src/components, src/hooks and src/services

3. Containerization with Docker
    What: Configured docker-compose.yml for PostgreSQL and Adminer.

    Why: *Isolation: Avoids cluttering the local OS with database installations.
    
    Parity: Ensures the database version (Postgres 15-alpine) is identical for everyone working on the project.
    
    Adminer: I added a GUI to 'see' the data without needing to master complex CLI commnads on day one

4. Data Modeling (Structs vs SQL)

    What: Defined Post and User as Go Structs and as SQL Tables 

    Why: in a typed backend, you need 'Two Worlds'
        The Database World: Tables, Rows and Foreign Keys(SQL).
        The Application World: Objects/Structs that Go can manipulate.

    Note: Use Struct Tags (e.g `json:'title'`) to fix Go's naming convetions (PascalCase) and JSON's convetions (camelCase/snake_case).


5. Database Connectivity in Go
    sql.Open vs Ping(): Open initializes the driver/pool, while Ping verifies the actual connection.

    Blank Imports (_): Used to register database drivers without calling them directly.

    Connection Pooling: Go’s sql.DB isn't a single connection; it’s a pool that automatically manages multiple connections for performance.

    DSN: The "Address" of the database, formatted as a connection string.

Phase 1: 2026-02-20
    
    Creating main.go file, that acts as the 'Manager' that starts the whole operation.

1. Docker failed due to CPU architecture (intel vs Apple Silicon) and
    macOS security (Quarantine flags)
                                
    Lesson: Infrastructure is secondary to Development. The fix: I pivoted to Postgres.app
    
    Why:  As a junior my goal is to learn Go. Fighting Docker for 3 days is a distraction. Using a native app (Postgres.app) or Homebrew provides the same database service but with 90% less 'friction'

2. Homebrew failed because of "Command Line Tools" 
    (CLT mismatch).
    
    Lesson: macOs isn't just a GUI; It's a Unix system. Most dev tools (Go, Brew, Postgres) rely on C compilers (Clang/GCC) hidden in the background. If those 'tools of the trade' are broken everything else chain reacts and fails.

3. The Go & Postgress Connection (the 'DSN' myster)
    I encountered a 'FATAL: unrecognized configuration parameter' error. This was a masterclass in how Go communicates with databases.
    
    The DSN (Data Source Name): This is a URL. Just like 'https://google.com', it has a protocol (postgres://), credentials (user:password), and a destination(localhost:5432).
    
    Typo Sensitivity: In the browser, if you type google.com/, it works. in a DSN, if you type sslomde instead of sslmode, the database driver crashes.
    
    Lesson: Backend code is unforgiving. Must be precise because there is no 'browser' to intelligently guess what you meant.

4. Database/sql vs pgx Relationships
    database/sql: This is built into Go: it's an interface. It know how to talk to any SQL database, but it does not know the 'lkanguage' of Postgres specifically.
    
    pgx: This is the Driver. It's the translator that speaks Postgres.
    
    The blank import: I used _'github.com/jackc/pgx/v5/stdlib'.

    Why: pgx functions are not called direcly. They are called with standard sql functions. The underscore tells Go: 'Hey, run the code inside pgx so it registers itself as a driver, then leave it alone'.
    
Phase 1: 2026-02-21

1. The Repository pattern
    Concept: I learned not to put SQL queries directly in the main logic. Instead, i created a repository layer.

    Why: This keeps the code clean. If i ever change my database, i only have to change one file, not the whole app.

2. Go Structs & JSON Mapping
    Learning: Used struct tags like JSON:"title" to tell Go how to format data for the web.

    Discovery: Go uses Capitalized names for internal logic, but the web usually expects lowercase. Tags bridge the gap.

3. The internal server error (500) vs (404)
    The Struggle: Encountered a 404 which taught me about Chi Router path matching.

    The Hurdles: Then hit a 500 error, which led to a deep dive into the database terminal.

    Lesson: I learned that 500 error often means the Handshake between Go and Postgres is broken (missing tables or column mismatches).

4. Postgres Terminal Mastery
    Succes: Manually created the posts table using SQL in the terminal.

    Key Command: Learned \d posts to verify that my table structure matches my Go modules.Post struct.

5. Dependency injection
    Wiring: I sucessfully wired the application: Database -> Repository -> Handler -> Router.

    The big win: Successfully established the Full Request Lifecycle.

    Browser asks for /posts -> Chi Router finds the path -> PostHandler calls the Repo -> PostRepository queries Postgres -> Postgres returns rows -> Go serializes it to JSON -> Browser displays data.

    Dynamic vs Static: Proved the API is dynamic by inserting data via the Postgres CLI and seeing it update in the browser without changing a single line of Go code.

    
Phase 2: Security & Identity 2026-02-22

1. Password zero trust policy
    Concept: Implemented the industry standard rule: Never store plain text passwords.

    Tool: Integrated golang.org/x/crypto/bcrypt.

    Technicality: Learned that Bcrypt handles salting automatically. A salt is a random string added to the password before hashing so that two users with the same password ('password1234') end up with two completly different looking hashes in the database.

2. User schema design (Postgres)
    Unique Constraints: Applied the UNIQUE constraints to the email column in the users table. This offloads the ('Does this user already exist?')
    check to the database level, which is faster and more reliable than checking it in Go code.

    Role based foundation: Added a role column (defaulting to 'user') to prepare for the Admin only features. 

3. Model mapping & JSON secuity
    The hyphen tag(json:"-"): Discovered the power of the hyphen tag in Go. By marking the PasswordHash field with json:"-", i have ensured that the hash stays on the server and is never leaked to the frontend, even if the whole User object os encoded to JSON/

    Clean separation: Created a dedicated User struct in /internal/models to match the new database schema.

4. Reusable utilities(/pkg)
    Logic vs Tooling: Placed the Bcrypt wrapper functions in /pkg/utils.

    Reasoning: Password hashing is a tool. By putting it in pkg, i am signaling that this code is a standalone helper that does not need to know anything about my specific Library business logic.

5. User related database operations
    internal/repository/user_repo.go: Handlers should not know how to write SQL. By moving the INSERT and SELECT queries into a Repository, the code stays modular.

    Scan & return: I learned how to use RET
    URNING id, created_at in Postgres. This allows Go to immediately populate the User struct with the database generated ID and timestamp without making a second query.
    
    Lesson: Using QueryRow is more efficient than Query when you only expect one result (like a single user or a new ID). It handles the row closing for you, which reduces the chance of memory leaks.

6. Registrtion Success 
    What: Successfully implemented a /register endpoint that accepts JSON,hashes passwords, and  saves users to PostgresSQL.

    The Evidence: Using postman, i received HTTP 201 created with a clean JSON response (no password leaked)

    Database: Verified the record exists with a $2a$14$ prefix, indicating a bcrypt algorithm with a cost factor of 14.

    Lesson: The json:"-" tag in the Go model is the MVP here. It allowed me to use the models.User struct to save the hash to the DB, but automatically stripped it out when sending the response back to the client.