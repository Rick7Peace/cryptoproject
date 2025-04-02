# Crypto Portfolio Management Application

This is a cryptocurrency portfolio management application built using React for the frontend and Node.js with Express for the backend. The application allows users to manage their cryptocurrency investments, track their portfolio performance, and log transactions.

## Features

- User authentication and authorization
- Add, update, and delete cryptocurrencies in the portfolio
- View transaction history
- Responsive design for mobile and desktop

## Technologies Used

- **Frontend**: React, React Router, CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Others**: Axios for API calls, Chart.js for data visualization

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
└── README.md
```

## Setup Instructions

### Backend

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your MongoDB database and update the connection string in `src/index.js`.

4. Start the server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React application:
   ```
   npm start
   ```

## Usage

Once both the backend and frontend are running, you can access the application in your web browser at `http://localhost:3000`. You can create an account, log in, and start managing your cryptocurrency portfolio.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.