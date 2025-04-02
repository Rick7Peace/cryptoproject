# backend/README.md

# Cryptocurrency Portfolio Management Application - Backend

## Overview
This backend application is built using Node.js and Express, providing a RESTful API for managing a cryptocurrency portfolio. It connects to a MongoDB database to store user portfolios, including details about various cryptocurrencies, transaction history, and user-specific data.

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd crypto-portfolio-app/backend
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the `backend` directory and add the following variables:
   ```
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   ```

4. **Run the application**
   ```
   npm start
   ```

## API Endpoints

### Portfolio Management

- **GET /api/portfolio**: Retrieve the user's portfolio.
- **POST /api/portfolio**: Create a new cryptocurrency entry in the portfolio.
- **PUT /api/portfolio/:id**: Update an existing cryptocurrency entry.
- **DELETE /api/portfolio/:id**: Delete a cryptocurrency entry from the portfolio.

## Technologies Used
- Node.js
- Express
- Mongoose
- JSON Web Token (JWT)
- MongoDB

## License
This project is licensed under the MIT License.