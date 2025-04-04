import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Define types for portfolio data
interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  amount: number;
  value: number;
}

const PortfolioHero = () => {
  const [portfolioCoins, setPortfolioCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API call
        const response = await fetch('/api/portfolio');
        
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        
        const data = await response.json();
        setPortfolioCoins(data);
        setError(null);
      } catch (err) {
        setError('Error fetching your portfolio. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // Function to navigate to add coins page
  const handleAddCoin = () => {
    router.push('/explore');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no coins in portfolio
  if (portfolioCoins.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No coins in your Portfolio</h2>
          <p className="text-gray-600 mb-6">
            Start building your crypto portfolio by adding some coins. Track their performance and manage your investments all in one place.
          </p>
          <button 
            onClick={handleAddCoin}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Coin
          </button>
        </div>
      </div>
    );
  }

  // Calculate total portfolio value
  const totalPortfolioValue = portfolioCoins.reduce((total, coin) => total + coin.value, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Portfolio</h1>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">${totalPortfolioValue.toLocaleString()}</p>
          <button 
            onClick={handleAddCoin}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add New Coin
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Portfolio table header */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 bg-gray-50">
          <div className="col-span-2 font-semibold">Coin</div>
          <div className="font-semibold text-right">Price</div>
          <div className="font-semibold text-right">24h</div>
          <div className="font-semibold text-right">Holdings</div>
          <div className="font-semibold text-right">Value</div>
        </div>

        {/* Portfolio items */}
        <div className="divide-y divide-gray-200">
          {portfolioCoins.map((coin) => (
            <div key={coin.id} className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-50">
              <div className="col-span-2 flex items-center">
                <div className="w-10 h-10 mr-3 flex-shrink-0">
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <div className="font-medium">{coin.name}</div>
                  <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                </div>
              </div>
              <div className="text-right self-center">
                ${coin.current_price.toLocaleString()}
              </div>
              <div className={`text-right self-center ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </div>
              <div className="text-right self-center">
                {coin.amount.toLocaleString()} {coin.symbol.toUpperCase()}
              </div>
              <div className="text-right self-center font-medium">
                ${coin.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioHero;