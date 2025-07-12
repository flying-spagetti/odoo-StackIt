# Core Server - Go Backend

## Setup

1. Install Go dependencies:
```bash
go mod tidy
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Run the server:
```bash
go run main.go
```

## Endpoints

- `GET /health` - Health check
- `GET /api/v1/test` - Test endpoint

Server runs on port 8080 by default.
