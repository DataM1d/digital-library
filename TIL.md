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
