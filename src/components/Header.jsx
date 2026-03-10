export default function Header({ isScrolled }) {
  return (
    <header className={`fixed top-0 w-full z-50 px-6 md:px-12 transition-all duration-300 bg-navy-dark/80 backdrop-blur-md border-b border-white/5 ${isScrolled ? 'py-2 shadow-2xl' : 'py-4'}`}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 border-2 border-gold-accent rounded-full flex items-center justify-center">
            <span className="text-gold-accent font-playfair font-bold text-xl">MBG</span>
          </div>
          <span className="hidden md:block font-playfair text-lg tracking-widest text-gold-accent uppercase">Kota Bandung</span>
        </div>
        <ul className="flex space-x-8 text-xs md:text-sm font-semibold tracking-widest uppercase text-light-grey/70">
          <li><a className="hover:text-gold-accent transition-colors" href="#home">Beranda</a></li>
          <li><a className="hover:text-gold-accent transition-colors" href="#statistics">Statistik</a></li>
          <li><a className="hover:text-gold-accent transition-colors" href="#mapping">Pemetaan</a></li>
          <li><a className="hover:text-gold-accent transition-colors" href="#contact">Kontak</a></li>
        </ul>
      </nav>
    </header>
  );
}