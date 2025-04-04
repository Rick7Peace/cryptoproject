import type { Route } from "./+types/landing";
import Header from '../components/global/Header';
import LandingHero from '../components/landing/landingHero';
import Features from '../components/landing/features';
import CTA from '../components/landing/CTA';
import Footer from '../components/global/Footer';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CryptoTrack - Your Personalized Cryptocurrency Portfolio" },
    { name: "description", content: "Track, analyze, and optimize your cryptocurrency investments in real-time. Get personalized insights and market alerts." },
  ];
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Header />
      <LandingHero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}