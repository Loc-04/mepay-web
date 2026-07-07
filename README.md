# MePay

MePay is a small personal finance pet project. It is a simple full-stack web app for tracking transactions and visualizing basic spending patterns.

This is not one of my main portfolio projects. I keep it public as a learning project for practicing React, Express, database access, authentication, and charts.

## Features

- User registration and login
- Transaction CRUD flow
- Basic transaction categorization
- Spending and income visualization
- REST API backend
- React frontend

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Chart.js
- React Chart.js 2
- Bootstrap / React Bootstrap
- React Icons
- XLSX

### Backend

- Node.js
- Express
- Sequelize
- MySQL-compatible database setup
- JWT
- bcryptjs
- CORS
- dotenv

## Repository Structure

```text
mepay-web/
├── backend/       # Express backend
├── frontend/      # React frontend
├── README.md
├── package.json
└── package-lock.json
```

## API Overview

Authentication:

- `POST /api/register`
- `POST /api/login`

Transactions:

- `GET /api/transactions`
- `POST /api/transactions`
- `GET /api/transactions/:id`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

## Running Locally

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=3001
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=mepay_db
JWT_SECRET=your_jwt_secret
```

## Notes

This repo is intentionally kept as a low-priority pet project. The main value is showing the basic full-stack flow: auth, CRUD, database connection, and chart-based UI.

## Author

Built by [Loc-04](https://github.com/Loc-04).

