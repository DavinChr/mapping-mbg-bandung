import React from 'react';

export default function Header({ isScrolled }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-header py-4 border-b border-white/10 shadow-2xl' : 'bg-transparent py-6'
      }`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-white">

        {/* LOGO CSS ONLY */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => scrollTo('home')}>
          <div className="w-10 h-10 border-2 border-gold-accent rounded-full flex items-center justify-center text-[10px] font-bold text-gold-accent shadow-[0_0_15px_rgba(212,175,55,0.3)]">MBG</div>
          <span className="font-playfair text-2xl tracking-wider text-gold-accent italic">MBG BANDUNG</span>
        </div>

        <nav className="hidden md:block">
          <ul className="flex gap-10">
            {['home', 'statistics', 'mapping', 'contact'].map((id) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className="text-xs font-black tracking-widest text-white/50 hover:text-gold-accent transition-all uppercase"
                >
                  {id === 'mapping' ? 'Pemetaan' : id}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}