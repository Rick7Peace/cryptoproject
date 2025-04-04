import React from 'react';

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

const Features: React.FC = () => {
  return (
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
  );
};

export default Features;