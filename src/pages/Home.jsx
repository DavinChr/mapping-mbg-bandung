import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Statistics from '../components/Statistics';
import MapSection from '../components/MapSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen relative text-white">
      <div className="bg-ornament"></div>
      <Header />

      <main>
        <section id="home" className="pt-28 pb-6">
          <Hero />
        </section>

        <section id="statistics" className="py-6">
          <Statistics />
        </section>

        <section id="mapping" className="py-8 px-2 md:px-6 lg:px-10">
          {/* BINGKAI GLASSMORPHISM */}
          <div className="w-full max-w-[1600px] mx-auto h-[800px] rounded-[3rem] glass-card shadow-2xl p-3 md:p-5">
            {/* PETA DI DALAM BINGKAI */}
            <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
              <MapSection />
            </div>
          </div>
        </section>

        <section id="contact">
          <Footer />
        </section>
      </main>
    </div>
  );
}