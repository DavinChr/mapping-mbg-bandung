import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Statistics from '../components/Statistics';
import MapSection from '../components/MapSection';
import Footer from '../components/Footer';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen selection:bg-gold-accent selection:text-navy-dark">
      <div className="bg-ornament"></div>
      
      {/* Oper state isScrolled ke Header sebagai props jika diperlukan */}
      <Header isScrolled={isScrolled} />

      <main className="pt-24 pb-12 px-6 md:px-12">
         <Hero />
         <Statistics />
         <MapSection />
      </main>

      <Footer />
    </div>
  );
}