import React from 'react';
import { Link } from 'react-router';

const CTA: React.FC = () => {
  return (
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
  );
};

export default CTA;