# Trudnik Backend

REST API for the Trudnik job board application, built with Node.js, Express, and PostgreSQL.


## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| ...    | `/api/companies` | Company-related routes |
| ...    | `/api/jobs` | Job listing routes |
| ...    | `/api/other` | Other routes |

## Project Structure

```
trudnik-backend/
├── controllers/       # Route handler logic
├── middleware/        # notFound, errorHandler
├── routes/            # Express routers
├── Queries/           # SQL query files
├── db.js              # PostgreSQL pool setup
└── server.js          # App entry point
```
