import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CryptoPrices {
  [key: string]: {
    usd: number;
  };
}

const Dashboard = () => {
  const [prices, setPrices] = useState<CryptoPrices | null>(null);  
  const [cryptoIds, setCryptoIds] = useState('bitcoin,ethereum');  

  useEffect(() => {
    axios
      .get<CryptoPrices>(`http://localhost:5000/api/crypto/prices?ids=${cryptoIds}`)
      .then((response) => {
        setPrices(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching crypto data:', error);
      });
  }, [cryptoIds]);  

  return (
    <div>
      <h1>Crypto Portfolio Tracker</h1>
      <input
        type="text"
        value={cryptoIds}
        onChange={(e) => setCryptoIds(e.target.value)}  
        placeholder="Enter crypto names (e.g., bitcoin, ethereum)"
      />
      {prices ? (
        <div>
          {Object.keys(prices).map((crypto) => (
            <h2 key={crypto}>
              {crypto.charAt(0).toUpperCase() + crypto.slice(1)} Price: ${prices[crypto].usd}
            </h2>
          ))}
        </div>
      ) : (
        <p>Loading crypto prices...</p>
      )}
    </div>
  );
};

export default Dashboard;