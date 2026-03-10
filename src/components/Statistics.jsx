export default function Statistics() {
  return (
    <section className="max-w-7xl mx-auto py-24 border-t border-white/5" id="statistics">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="glass-card p-8 rounded-lg text-center space-y-4 group hover:border-gold-accent/30 transition-all">
          <div className="w-12 h-12 mx-auto mb-4 text-gold-accent">
            <svg className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147L12 4.147l7.74 6M6.12 10.147V19.5h11.76V10.147"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5v-3.75a1.5 1.5 0 0 1 3 0V19.5"></path>
            </svg>
          </div>
          <h3 className="text-4xl font-playfair text-white">432</h3>
          <p className="text-xs uppercase tracking-widest text-gold-accent">Jumlah Sekolah</p>
        </div>

        <div className="glass-card p-8 rounded-lg text-center space-y-4 group hover:border-gold-accent/30 transition-all">
          <div className="w-12 h-12 mx-auto mb-4 text-gold-accent">
            <svg className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"></path>
            </svg>
          </div>
          <h3 className="text-4xl font-playfair text-white">12</h3>
          <p className="text-xs uppercase tracking-widest text-gold-accent">Jumlah SPPG</p>
        </div>

        <div className="glass-card p-8 rounded-lg text-center space-y-4 group hover:border-gold-accent/30 transition-all">
          <div className="w-12 h-12 mx-auto mb-4 text-gold-accent">
            <svg className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 4.5 4.5 0 0 1-1.57 3.921Z"></path>
            </svg>
          </div>
          <h3 className="text-4xl font-playfair text-white">850+</h3>
          <p className="text-xs uppercase tracking-widest text-gold-accent">Buruan SAE</p>
        </div>

        <div className="glass-card p-8 rounded-lg text-center space-y-4 group hover:border-gold-accent/30 transition-all">
          <div className="w-12 h-12 mx-auto mb-4 text-gold-accent">
            <svg className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path>
            </svg>
          </div>
          <h3 className="text-4xl font-playfair text-white">0.92</h3>
          <p className="text-xs uppercase tracking-widest text-gold-accent">Indeks Ketahanan</p>
        </div>
      </div>
    </section>
  );
}