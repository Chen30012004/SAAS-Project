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

## Prerequisites 🛠️

- Docker & Docker Compose (Recommended)
- OR Node.js (v18+) and local PostgreSQL

## Getting Started (Docker - Recommended) 🐳

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
   - Frontend: \`http://localhost\`
   - Backend API: \`http://localhost:5000\`

## Architecture Highlights 🏗️

- **Layered Architecture**: Separation of concerns between Routes, Controllers, and Database configs.
- **Database Transactions**: Used \`BEGIN\`, \`COMMIT\`, and \`ROLLBACK\` for secure purchase handling.
- **JSONB**: Utilized PostgreSQL's \`JSONB\` data type to store flexible feature arrays.
