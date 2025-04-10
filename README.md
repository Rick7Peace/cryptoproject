# 🚀 Crypto Portfolio Tracker

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v5-green.svg)](https://www.mongodb.com/)

A comprehensive web application for cryptocurrency investors to track portfolios, monitor investments, and make data-driven decisions.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Technologies Used](#-technologies-used)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## Overview

Crypto Portfolio Tracker provides investors with a comprehensive platform to manage cryptocurrency investments. Track real-time values, set price alerts, analyze portfolio performance, and generate tax reports—all in one secure application.

## ✨ Key Features

### 📊 Real-Time Portfolio Dashboard
- **Live Price Updates**: Connects to CoinGecko API for real-time cryptocurrency prices
- **Portfolio Valuation**: Instantly see your total portfolio value and individual asset performances
- **Customizable Views**: Sort and filter your assets by value, performance, or acquisition date

### 📈 Advanced Portfolio Analytics
- **Performance Metrics**: Track ROI, daily/weekly/monthly gains, and historical performance
- **Diversification Analysis**: Visual breakdown of portfolio allocation across different assets
- **Risk Assessment**: Identifies concentration risks and suggests portfolio optimizations

### 🔔 Smart Alerts System
- **Price Thresholds**: Set custom alerts for price targets (both upper and lower limits)
- **Volatility Notifications**: Get notified of unusual market movements affecting your assets
- **Trend Indicators**: Receive alerts for significant market trend changes

### 📝 Comprehensive Transaction Tracking
- **Transaction History**: Log all buy/sell activities with detailed information
- **Cost Basis Calculation**: Automatically calculates your average acquisition price
- **Performance Visualization**: See how each transaction affected your overall portfolio

### 📰 Personalized News Feed
- **Asset-Specific News**: Curated news articles related to cryptocurrencies in your portfolio
- **Market Analysis**: Expert insights on market trends relevant to your investments
- **Sentiment Tracking**: Gauge market sentiment around your held assets

### 📑 Tax Reporting Tools
- **Annual Tax Reports**: Generate year-end summaries of trading activity
- **Capital Gains Calculation**: Automatically calculate realized gains/losses
- **Export Options**: Download reports in various formats for tax filing purposes

## 🖼️ Screenshots

![Dashboard View](frontend\public\images\image.png)


## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB account
- CoinGecko API key (or alternative crypto data provider)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rick7Peace/cryptoproject.git
   cd cryptoproject
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the backend directory:
   ```
   COINGECKO_API_KEY=your_api_key
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the application**
   
   Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend:
   ```bash
   cd client
   npm start
   ```

   The application will be available at http://localhost:3000

## 🛠️ Technologies Used

### Frontend
- **React**: Component-based UI library
- **Chart.js**: Interactive data visualization
- **Axios**: API request handling
- **React Router**: Application routing
- **Context API**: State management

### Backend
- **Node.js & Express**: Server-side application framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication mechanism
- **CoinGecko API**: Cryptocurrency market data

## 👥 Contributing

We welcome contributions to improve the Crypto Portfolio Tracker! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Project Creators - [@Pathol](https://github.com/Pathol),[@DeenTradesCode](https://github.com/DeenTradesCode),[@njpichardo](https://github.com/njpichardo),[@Rick7Peace](https://github.com/Rick7Peace)


Project Link: [https://github.com/Rick7Peace/cryptoproject](https://github.com/Rick7Peace/cryptoproject)