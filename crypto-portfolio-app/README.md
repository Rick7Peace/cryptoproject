# Cryptocurrency Portfolio Management Application

This project is a cryptocurrency portfolio management application built using React for the frontend and Node.js with Express for the backend. It allows users to manage their cryptocurrency investments, track their portfolio performance, and log transactions.

## Features

- User authentication and authorization
- Add, update, and delete cryptocurrencies in the portfolio
- View transaction history
- Responsive design for mobile and desktop

## Technology Stack

- **Frontend**: React, React Router, CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Others**: JWT for authentication, Axios for API calls

## Project Structure

```
crypto-portfolio-app
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── routes
│   │   ├── styles
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   └── README.md
├── README.md
└── .gitignore
```

## Setup Instructions

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your MongoDB connection in `src/index.js`.
4. Start the server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```

## API Endpoints

- `POST /api/portfolio`: Create a new portfolio entry
- `GET /api/portfolio`: Retrieve all portfolio entries
- `PUT /api/portfolio/:id`: Update a portfolio entry
- `DELETE /api/portfolio/:id`: Delete a portfolio entry

## License

This project is licensed under the MIT License.