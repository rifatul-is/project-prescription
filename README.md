# Project Prescription

A simple prescription management application built with a Spring Boot backend and a Vite/React frontend.

## Run with Docker

1. Ensure Docker and Docker Compose are installed.
2. From the repository root, run:
   ```
   docker compose up --build
   ```
3. The frontend starts on `http://localhost:5173` (React default dev port).
4. The backend API is available on `http://localhost:8080`.

## Default Credentials

- Username: `admin`
- Password: `admin`

Update the environment variables in `docker-compose.yml` if you need different credentials for your environment.
