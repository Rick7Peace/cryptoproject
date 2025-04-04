import Link from 'next/link';
import { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Sample data - replace with your actual API call
const samplePortfolioHistory = {
  labels: ['1 Month Ago', '3 Weeks Ago', '2 Weeks Ago', '1 Week Ago', 'Today'],
  datasets: [
    {
      label: 'Portfolio Value ($)',
      data: [12400, 13100, 12800, 14500, 15200],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      tension: 0.3,
    },
  ],
};

// Sample allocation data - replace with actual portfolio data
const sampleAllocationData = {
  labels: ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'Other'],
  datasets: [
    {
      label: 'Portfolio Allocation',
      data: [45, 30, 10, 8, 7],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const PortfolioFeatures = () => {
  const [activeTab, setActiveTab] = useState('performance');

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Portfolio Analytics</h2>

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab('performance')}
          className={`py-2 px-4 ${
            activeTab === 'performance'
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-600'
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab('allocation')}
          className={`py-2 px-4 ${
            activeTab === 'allocation'
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-600'
          }`}
        >
          Allocation
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        {activeTab === 'performance' ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
            <div className="h-80">
              <Line 
                data={samplePortfolioHistory} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `$${context.parsed.y.toLocaleString()}`;
                        }
                      }
                    }
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
            <div className="h-80 flex items-center justify-center">
              <div className="w-full max-w-md">
                <Pie 
                  data={sampleAllocationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Portfolio Management */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Manage Holdings</h3>
          </div>
          <p className="text-gray-600 mb-4">Add, remove, or update your crypto holdings to keep your portfolio current.</p>
          <Link href="/portfolio/manage" className="text-blue-600 hover:text-blue-800 font-medium">
            Update Portfolio →
          </Link>
        </div>

        {/* Price Alerts */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-amber-100 rounded-full mr-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Price Alerts</h3>
          </div>
          <p className="text-gray-600 mb-4">Set up notifications for price movements on specific cryptocurrencies.</p>
          <Link href="/alerts" className="text-blue-600 hover:text-blue-800 font-medium">
            Manage Alerts →
          </Link>
        </div>

        {/* Export Data */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Export Data</h3>
          </div>
          <p className="text-gray-600 mb-4">Download your portfolio data for tax reporting or personal records.</p>
          <Link href="/portfolio/export" className="text-blue-600 hover:text-blue-800 font-medium">
            Export CSV/PDF →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortfolioFeatures;