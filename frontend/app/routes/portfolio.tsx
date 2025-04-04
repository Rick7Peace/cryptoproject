import { useState, useEffect } from 'react';
import axios from 'axios';

interface Crypto {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<Crypto[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Replace with your backend API endpoint
        const response = await axios.get('/api/portfolio');
        const portfolioData: Crypto[] = response.data;

        // Calculate total portfolio value
        const total = portfolioData.reduce((sum, crypto) => sum + crypto.price * crypto.quantity, 0);

        setPortfolio(portfolioData);
        setTotalValue(total);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div>
      <h1>Your Crypto Portfolio</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (USD)</th>
            <th>Quantity</th>
            <th>Total Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((crypto) => (
            <tr key={crypto.id}>
              <td>{crypto.name}</td>
              <td>${crypto.price.toFixed(2)}</td>
              <td>{crypto.quantity}</td>
              <td>${(crypto.price * crypto.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Total Portfolio Value: ${totalValue.toFixed(2)}</h2>
    </div>
  );
};

export default Portfolio;