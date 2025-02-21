# Store Rating System

A web application that allows users to rate and review stores. The system has three types of users: administrators, normal users, and store owners.

## Features

### For Normal Users
- Sign up and login to the platform
- View all registered stores
- Search stores by name and address
- Submit ratings (1-5 stars) for stores
- Modify their existing ratings
- Update their password

### For Store Owners
- Login to view their store's performance
- See list of users who rated their store
- View their store's average rating
- Update their password

### For Administrators
- Add new stores and users
- View comprehensive dashboard with total users, stores, and ratings
- Manage all users and stores
- Filter and sort users/stores by various criteria

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. Set up your environment variables in `.env`:
   ```
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the servers:
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend development server
   cd frontend
   npm run dev
   ```

5. Access the application at `http://localhost:5173`

## Data Validation Rules

- **Name**: 20-60 characters
- **Address**: Maximum 400 characters
- **Email**: Must be valid email format
- **Ratings**: Must be between 1 and 5

## API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - User login 
- GET `/auth/me` - Get current user info

### Stores
- GET `/stores` - Get all stores
- POST `/stores` - Add new store (Admin only)

### Ratings
- POST `/ratings` - Submit a rating
- PUT `/ratings/:id` - Update a rating

### Admin
- GET `/admin/dashboard` - Get dashboard statistics
- GET `/users` - Get all users (Admin only)
