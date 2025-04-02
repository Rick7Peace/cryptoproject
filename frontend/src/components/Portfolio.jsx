import React, { useState, useEffect } from 'react';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        setPortfolio(data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your Cryptocurrency Portfolio</h1>
      <ul>
        {portfolio.map((item) => (
          <li key={item.id}>
            {item.name}: {item.amount} (Purchased at ${item.purchasePrice})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Portfolio;