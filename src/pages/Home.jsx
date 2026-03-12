import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Statistics from '../components/Statistics';
import MapSection from '../components/MapSection';
import Footer from '../components/Footer';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1221] text-white relative">
      {/* Background Ornamen fixed di belakang */}
      <div className="fixed inset-0 bg-ornament opacity-[0.03] pointer-events-none"></div>

      <Header isScrolled={isScrolled} />

      <main className="relative z-10">
        <section id="home" className="pt-32 pb-6 px-6 max-w-7xl mx-auto">
          <Hero />
        </section>

        <section id="statistics" className="py-6 px-6 max-w-7xl mx-auto">
          <Statistics />
        </section>

        {/* MAP SECTION - DIKEMBALIKAN KE CLEAN GLASS LOOK, TAPI TINGGI DIPENDEKKAN */}
        <section id="mapping" className="py-12 px-4 md:px-8 relative z-10">
          {/* Tinggi Map dikurangi: h-[60vh] dan min-h-[500px] */}
          <div className="w-full max-w-[1600px] mx-auto h-[60vh] min-h-[500px] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl bg-navy-dark relative">

            {/* Overlay Gradient Halus di atas peta agar teks header tidak tumpang tindih */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0B1221]/60 to-transparent z-0 pointer-events-none"></div>

            <MapSection />
          </div>
        </section>

        <section id="contact" className="py-12">
          <Footer />
        </section>
      </main>
    </div>
  );
}