# SAAS Credits Module 🚀

A full-stack web application demonstrating a complete Credits and Package management system for a SaaS product. Built as part of a Backend Developer Intern assignment.

## Features ✨

- **User Authentication**: Secure Registration & Login using JWT and Bcrypt.
- **Package Management**: CRUD operations for credit packages (Basic, Pro, VIP).
- **Purchase Flow**: Simulated payment gateway with robust PostgreSQL Transactions to ensure data integrity.
- **Credit System**: Real-time credit updates and feature unlocking.
- **Role-Based Authorization**: High-Order Function Middlewares to restrict API endpoints based on unlocked features (e.g., \`IMAGE_GENERATION\`).
- **Modern UI**: A responsive, Glassmorphism-inspired Dashboard built with React and Vite.

## Tech Stack 💻

- **Frontend**: React (Vite), React Router, Axios, Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (using \`pg\` driver with Connection Pools).
- **DevOps**: Docker & Docker Compose (Multi-stage builds).

---

## 🚀 Getting Started (Option 1: Using Docker - Recommended)

The easiest way to run the application is using Docker Compose.

1. Start the application:
   \`\`\`bash
   docker compose up --build -d
   \`\`\`
2. Initialize tables and seed the database:
   \`\`\`bash
   docker exec saas_backend node src/scripts/initDb.js
   docker exec saas_backend node src/scripts/seedPackages.js
   \`\`\`
3. Access the application:
   - Frontend: **\`http://localhost\`** (Nginx serves on port 80)
   - Backend API: \`http://localhost:5000\`

---

## 💻 Getting Started (Option 2: Local Setup - Without Docker)

If you prefer to run the application directly on your machine using Node.js:

### 1. Setup Database
You must have PostgreSQL installed locally (or run just the DB via docker: \`docker compose up -d postgres\`).
Make sure your \`backend/.env\` file has the correct database credentials.

### 2. Run Backend
Open a terminal and run:
\`\`\`bash
cd backend
npm install
node src/scripts/initDb.js         # Initialize tables
node src/scripts/seedPackages.js   # Seed packages
npm run dev                        # Start server on port 5000
\`\`\`

### 3. Run Frontend
Open a **new** terminal and run:
\`\`\`bash
cd frontend
npm install
npm run dev                        # Start Vite server on port 5173
\`\`\`

4. Access the application:
   - Frontend: **\`http://localhost:5173\`**
   - Backend API: \`http://localhost:5000\`

---

## Architecture Highlights 🏗️

- **Layered Architecture**: Separation of concerns between Routes, Controllers, and Database configs.
- **Database Transactions**: Used \`BEGIN\`, \`COMMIT\`, and \`ROLLBACK\` for secure purchase handling.
- **JSONB**: Utilized PostgreSQL's \`JSONB\` data type to store flexible feature arrays.
