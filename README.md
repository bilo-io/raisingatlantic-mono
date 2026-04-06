# Raising Atlantic Monorepo 🌊

Welcome to the **Raising Atlantic** monorepo. This project is built using a modern, scalable stack and managed with **Moonrepo** to ensure high performance and consistent developer workflows.

## 🚀 Quickstart

Get up and running in minutes:

1.  **Install dependencies:**
    ```bash
    moon run :install
    ```
2.  **Start your database (Docker):**
    ```bash
    moon run :db-start
    ```
3.  **Run migrations & seed initial data:**
    ```bash
    moon run :db-migrate
    moon run :db-seed
    ```
4.  **Start the development server:**
    ```bash
    moon run :dev
    ```

The API will be available at `http://localhost:3000/v1/`.
The Frontend will be available at `http://localhost:9002/`.

---

## 🛠 Project Workflow

We use **Moonrepo** to orchestrate all project-level and monorepo-level tasks.

### 🗄 Database Management
All database commands are unified across the monorepo root:
- `moon run :db-start`: Spins up the PostgreSQL container (mapped to port `5433`).
- `moon run :db-stop`: Shuts down the database.
- `moon run :db-migrate`: Applies all pending database migrations.
- `moon run :db-seed`: Populates the database with initial developer data.

### 🏗 API & Development
- `moon run :build`: Builds all applications (API, Web, etc.).
- `moon run :dev`: Starts the API and Web watchers simultaneously.

---

## 🏗 Repository Structure

-   `src/apps/api`: NestJS API.
-   `src/apps/web`: React Next.js application.
-   `src/pkgs/ui`: Shared UI component library.
-   `src/core`: Shared logic, interfaces, and telemetry.
-   `tests/postman`: API integration tests and Postman collections.

## 📡 API Versioning

All API endpoints strictly follow the `v1` prefix convention. 
Example: `GET http://localhost:3000/v1/examples`

---

## ❓ FAQ

### Why is there a `migrations` table in my database?
The `migrations` table is automatically created by TypeORM. It is **essential for schema stability**. 
It acts as a record of which versioned migration files have already been applied to the database. Without this table, the system wouldn't know which changes are new, leading to errors when attempting to recreate existing tables or columns during a migration run.

### Why port `5433`?
If you have a local PostgreSQL installation (like via Homebrew or PostgreSQL.app), it typically hijacks port `5432`. We map Docker to `5433` to allow both to coexist without conflicts.
