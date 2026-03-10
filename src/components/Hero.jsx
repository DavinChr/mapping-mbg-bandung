export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto min-h-[70vh] flex flex-col md:flex-row items-center justify-between gap-12 py-12" id="home">
      <div className="md:w-1/2 space-y-6">
        <h1 className="font-playfair text-5xl md:text-7xl leading-tight">
          MBG <span className="text-gold-accent italic block">Kota Bandung</span>
        </h1>
        <div className="w-24 h-1 bg-gold-accent"></div>
        <p className="text-lg text-light-grey/80 font-light leading-relaxed max-w-lg">
          Makan Bergizi Gratis (MBG) adalah inisiatif strategis pemerintah Kota Bandung untuk memperkuat ketahanan pangan keluarga dan memastikan setiap anak didik mendapatkan asupan nutrisi optimal demi masa depan yang lebih cerah.
        </p>
        <div className="flex space-x-4 pt-4">
          <button className="px-8 py-3 bg-gold-accent text-navy-dark font-bold rounded-sm hover:bg-white transition-all transform hover:-translate-y-1">Pelajari Lebih Lanjut</button>
          <button className="px-8 py-3 border border-gold-accent text-gold-accent font-bold rounded-sm hover:bg-gold-accent/10 transition-all">Lihat Data</button>
        </div>
      </div>
      <div className="md:w-1/2 relative group">
        <div className="absolute -inset-4 bg-gold-accent/10 blur-2xl rounded-full group-hover:bg-gold-accent/20 transition-all duration-700"></div>
        <div className="relative rounded-2xl overflow-hidden frame-border p-4">
          <img alt="Representasi Keadilan dan Ketahanan" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 opacity-60 hover:opacity-100" src={'${import.meta.env.BASE_URL}'} />
        </div>
      </div>
    </section>
  );
}