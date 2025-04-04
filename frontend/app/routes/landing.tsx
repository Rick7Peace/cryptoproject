import type { Route } from "./+types/landing";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CryptoTrack - Your Personalized Cryptocurrency Portfolio" },
    { name: "description", content: "Track, analyze, and optimize your cryptocurrency investments in real-time. Get personalized insights and market alerts." },
  ];
}

// State for trending coins
const [trendingCoins, setTrendingCoins] = useState([
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: '61,247.83', change: '+2.4%', color: 'text-green-500' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: '3,459.22', change: '+1.8%', color: 'text-green-500' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: '139.65', change: '+5.7%', color: 'text-green-500' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: '0.59', change: '-0.9%', color: 'text-red-500' },
]);

// Fetch trending coins data from CoinGecko API
useEffect(() => {
  const fetchTrendingCoins = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            ids: "bitcoin,ethereum,solana,cardano",  // You can dynamically add more coin IDs here
          }
        });
      setTrendingCoins(response.data);
    } catch (error) {
      console.error("Error fetching coin data:", error);
    }
  };

  fetchTrendingCoins();
}, []);

// Sample features data
const features = [
  {
    title: "Real-Time Portfolio Tracking",
    description: "Monitor your crypto assets across multiple wallets and exchanges in one place",
    icon: "📊"
  },
  {
    title: "Advanced Analytics",
    description: "Gain deep insights with custom charts, performance metrics, and historical data",
    icon: "📈"
  },
  {
    title: "Smart Alerts",
    description: "Stay updated with customizable price alerts and market movement notifications",
    icon: "🔔"
  },
  {
    title: "Tax Reporting",
    description: "Generate tax reports for your crypto transactions with just a few clicks",
    icon: "📑"
  }
];

export default function Landing() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">CryptoTrack</span>
        </div>
        <div className="hidden md:flex space-x-8 items-center">
          <a href="#features" className="hover:text-blue-400 transition">Features</a>
          <a href="#pricing" className="hover:text-blue-400 transition">Pricing</a>
          <Link to="/login" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition">Login</Link>
          <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 transition">Sign Up</Link>
        </div>
        <button className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 md:pr-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Master Your Crypto Portfolio</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Track, analyze, and optimize your cryptocurrency investments with powerful tools and real-time data.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-center hover:opacity-90 transition text-white font-medium text-lg shadow-lg shadow-blue-500/20">
              Get Started
            </Link>
            <Link to="/demo" className="px-8 py-3 border border-blue-400 rounded-lg text-center hover:bg-blue-900/20 transition text-blue-400 font-medium text-lg">
              View Demo
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-50"></div>
            <div className="relative bg-slate-800 rounded-lg p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Trending Coins</h3>
                <span className="text-sm text-gray-400">
                  Last updated: {currentTime.toLocaleTimeString()}
                </span>
              </div>
              <div className="space-y-4">
                {trendingCoins.map(coin => (
                  <div key={coin.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-700 rounded-full mr-3 flex items-center justify-center">
                        {coin.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-sm text-gray-400">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${coin.price}</p>
                      <p className={`text-sm ${coin.color}`}>{coin.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-800/50 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CryptoTrack?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Everything you need to manage your cryptocurrency portfolio, all in one place.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-blue-500/10 hover:translate-y-[-5px] transition duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-2/3 md:pr-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to take control of your crypto investments?</h2>
              <p className="text-lg text-blue-100 mb-6">Join thousands of investors who trust CryptoTrack for their portfolio management.</p>
            </div>
            <div className="md:w-1/3 flex flex-col space-y-4">
              <Link to="/register" className="px-8 py-3 bg-white text-blue-600 rounded-lg text-center hover:bg-gray-100 transition font-medium text-lg">
                Create Free Account
              </Link>
              <Link to="/login" className="px-8 py-3 bg-transparent border border-white rounded-lg text-center hover:bg-white/10 transition font-medium text-lg">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">CryptoTrack</span>
              <p className="text-gray-400 mt-2">Your personal cryptocurrency portfolio tracker</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-blue-400">About</a></li>
                  <li><a href="#" className="hover:text-blue-400">Blog</a></li>
                  <li><a href="#" className="hover:text-blue-400">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-blue-400">Help Center</a></li>
                  <li><a href="#" className="hover:text-blue-400">Contact</a></li>
                  <li><a href="#" className="hover:text-blue-400">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-blue-400">Privacy</a></li>
                  <li><a href="#" className="hover:text-blue-400">Terms</a></li>
                  <li><a href="#" className="hover:text-blue-400">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">© 2025 CryptoTrack. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
