export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto py-12 px-6 md:px-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8" id="contact">
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
          <div className="w-8 h-8 border border-gold-accent rounded-full flex items-center justify-center text-[10px] text-gold-accent">MBG</div>
          <span className="font-playfair text-xl tracking-wider">MBG BANDUNG</span>
        </div>
        <p className="text-sm text-light-grey/40">© 2024 Dinas Ketahanan Pangan dan Pertanian Kota Bandung.</p>
      </div>
      <div className="flex space-x-8 text-xs font-semibold tracking-widest text-light-grey/60 uppercase">
        <a className="hover:text-gold-accent" href="#">Privacy</a>
        <a className="hover:text-gold-accent" href="#">Documentation</a>
        <a className="hover:text-gold-accent" href="#">API Access</a>
      </div>
    </footer>
  );
}