import Link from 'next/link';

const PortfolioCTA = () => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-2/3 md:pr-6 text-white">
            <h2 className="text-xl md:text-2xl font-bold mb-3">Take your portfolio to the next level</h2>
            <p className="text-indigo-100 mb-4">
              Discover advanced analytics, set up price alerts, and get personalized investment insights.
            </p>
          </div>
          <div className="md:w-1/3 flex flex-col space-y-3 md:space-y-0 md:space-x-3 md:flex-row">
            <Link 
              href="/portfolio/alerts" 
              className="px-5 py-2 bg-white text-indigo-600 rounded-lg text-center hover:bg-gray-100 transition font-medium"
            >
              Set Price Alerts
            </Link>
            <Link 
              href="/learn" 
              className="px-5 py-2 bg-transparent border border-white text-white rounded-lg text-center hover:bg-white/10 transition font-medium"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioCTA;