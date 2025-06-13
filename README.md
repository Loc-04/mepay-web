# MePay - Personal Finance Management Application

MePay is a full-stack web application designed to help users manage their personal finances, track transactions, and visualize their spending patterns.

## Project Structure

The project is divided into two main parts:

### Frontend (`/frontend`)
- Built with React.js
- Uses modern React features and hooks
- Implements Chart.js for data visualization
- Features a responsive and user-friendly interface
- Key dependencies:
  - React 19.1.0
  - React Router DOM 7.6.2
  - Chart.js 4.4.9
  - React Chart.js 2 5.3.0

### Backend (`/backend`)
- Node.js/Express.js server
- Sequelize ORM for database management
- RESTful API architecture
- Key features:
  - User authentication
  - Transaction management
  - Database integration
  - CORS enabled for frontend communication

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- MySQL or compatible database
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd Mepay
```

2. Set up the backend
```bash
cd backend
npm install
# Create a .env file with necessary environment variables
npm start
```

3. Set up the frontend
```bash
cd frontend
npm install
npm start
```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
PORT=3001
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=mepay_db
```

## Features

- User Authentication
  - Registration
  - Login
  - Session management

- Transaction Management
  - Add transactions
  - View transaction history
  - Categorize transactions

- Data Visualization
  - Spending patterns
  - Income tracking
  - Financial analytics

## API Endpoints

### Authentication
- POST `/api/register` - User registration
- POST `/api/login` - User login

### Transactions
- GET `/api/transactions` - Get all transactions
- POST `/api/transactions` - Create new transaction
- GET `/api/transactions/:id` - Get specific transaction
- PUT `/api/transactions/:id` - Update transaction
- DELETE `/api/transactions/:id` - Delete transaction

## Development

The project uses a modern development stack with:
- React for frontend development
- Express.js for backend API
- Sequelize for database operations
- Chart.js for data visualization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 