import React, { useEffect } from 'react';

const Dashboard: React.FC = () => {

  useEffect(() => { 
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h1>Crypto Portfolio Dashboard</h1>
      
      {/* TradingView Widget */}
      <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
        <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
        <div className="tradingview-widget-copyright">
          <a href="https://www.tradingview.com" rel="noopener" target="_blank">
            <span className="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            new TradingView.widget({
              "autosize": true,
              "symbol": "BITFINEX:BTCUSD",  // Modify this line for the desired crypto coin symbol
              "interval": "D",
              "timezone": "Etc/UTC",
              "theme": "dark",
              "style": "1",
              "locale": "en",
              "allow_symbol_change": true,
              "support_host": "https://www.tradingview.com"
            });
          `}} />
      </div>
    </div>
  );
};

export default Dashboard;
