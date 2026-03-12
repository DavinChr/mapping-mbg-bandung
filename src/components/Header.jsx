import React from 'react';

export default function Header({ isScrolled }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      // Offset disesuaikan dengan tinggi header yang baru
      window.scrollTo({ top: el.offsetTop - 85, behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      // TRUE GLASSMORPHISM: Sangat Transparan (/30) tapi Blur Parah (xl)
      isScrolled ? 'bg-[#0B1221]/30 backdrop-blur-xl py-4 border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'
      }`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-white">

        {/* LOGO AREA */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => scrollTo('home')}>
          {/* Tambahkan sedikit efek glow pada border logo agar menonjol di atas blur */}
          <div className="w-10 h-10 border-2 border-gold-accent rounded-full flex items-center justify-center text-xs font-bold text-gold-accent shadow-[0_0_15px_rgba(212,175,55,0.3)]">MBG</div>
          <span className="font-playfair text-2xl tracking-wider text-gold-accent italic">MBG BANDUNG</span>
        </div>

        {/* NAVIGASI AREA */}
        <nav className="hidden md:block">
          <ul className="flex gap-10">
            <li><button onClick={() => scrollTo('home')} className="text-xs font-black tracking-widest text-white/50 hover:text-gold-accent transition-all uppercase">Beranda</button></li>
            <li><button onClick={() => scrollTo('statistics')} className="text-xs font-black tracking-widest text-white/50 hover:text-gold-accent transition-all uppercase">Statistik</button></li>
            <li><button onClick={() => scrollTo('mapping')} className="text-xs font-black tracking-widest text-white/50 hover:text-gold-accent transition-all uppercase">Pemetaan</button></li>
            <li><button onClick={() => scrollTo('contact')} className="text-xs font-black tracking-widest text-white/50 hover:text-gold-accent transition-all uppercase">Kontak</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}