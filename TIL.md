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

4.  Data Modeling (Structs vs SQL)

    What: Defined Post and User as Go Structs and as SQL Tables 

    Why: in a typed backend, you need 'Two Worlds'
        The Database World: Tables, Rows and Foreign Keys(SQL).
        The Application World: Objects/Structs that Go can manipulate.

    Note: Use Struct Tags (e.g `json:'title'`) to fix Go's naming convetions (PascalCase) and JSON's convetions (camelCase/snake_case).


Database Connectivity in Go
    sql.Open vs Ping(): Open initializes the driver/pool, while Ping verifies the actual connection.

    Blank Imports (_): Used to register database drivers without calling them directly.

    Connection Pooling: Go’s sql.DB isn't a single connection; it’s a pool that automatically manages multiple connections for performance.

    DSN: The "Address" of the database, formatted as a connection string.

Phase 1: Continuing 2026-02-20
    
    Creating main.go file, that acts as the 'Manager' that starts the whole operation.

Obstacles today: 
    Docker failed due to CPU architecture (intel vs Apple Silicon) and macOS security (Quarantine flags)
    -                                      
    Lesson -> Infrastructure is secondary to Development. The fix: I pivoted to Postgres.app
    -
    Why -> As a junior my goal is to learn Go. Fighting Docker for 3 days is a distraction. Using a native app (Postgres.app) or Homebrew provides the same database service but with 90% less 'friction'

    2. Homebrew failed because of "Command Line Tools" 
    (CLT mismatch).
    -
    Lesson -> macOs isn't just a GUI; It's a Unix system. Most dev tools (Go, Brew, Postgres) rely on C compilers (Clang/GCC) hidden in the background. If those 'tools of the trade' are broken everything else chain reacts and fails.

The Go & Postgress Connection (the 'DSN' myster)
    I encountered a 'FATAL: unrecognized configuration parameter' error. This was a masterclass in how Go communicates with databases.
    -
    The DSN (Data Source Name) -> This is a URL. Just like 'https://google.com', it has a protocol (postgres://), credentials (user:password), and a destination(localhost:5432).
    -
    Typo Sensitivity -> In the browser, if you type google.com/, it works. in a DSN, if you type sslomde instead of sslmode, the database driver crashes.
    -
    Lesson -> Backend code is unforgiving. Must be precise because there is no 'browser' to intelligently guess what you meant.

Database/sql vs pgx Relationships
    database/sql -> This is built into Go: it's an interface. It know how to talk to any SQL database, but it does not know the 'lkanguage' of Postgres specifically.
    -
    pgx -> This is the Driver. It's the translator that speaks Postgres.
    -
    The blank import -> I used _'github.com/jackc/pgx/v5/stdlib'
        why -> pgx functions are not called direcly. They are called with standard sql functions. The underscore tells Go: 'Hey, run the code inside pgx so it registers itself as a driver, then leave it alone'.
    
