import React, { useState, useMemo } from 'react';
import { Map, Source, Layer, Popup } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import Papa from 'papaparse';
import 'maplibre-gl/dist/maplibre-gl.css';

// --- IMPORT DATA ---
import sekolahRaw from '../data/sekolah.csv?raw';
import sppgRaw from '../data/sppg.csv?raw';
import buruanRaw from '../data/buruan_sae.csv?raw';
import fsvaRaw from '../data/fsva.csv?raw';

export default function MapSection() {
  const [selectedFilters, setSelectedFilters] = useState(['SMA', 'SMK', 'MA', 'PAUD', 'TK', 'KB', 'SPPG', 'Buruan Sae', 'FSVA']);
  const [hoverInfo, setHoverInfo] = useState(null);

  const datasets = useMemo(() => {
    const parse = (raw) => Papa.parse(raw, { header: true, skipEmptyLines: true }).data;
    return {
      sekolah: parse(sekolahRaw),
      sppg: parse(sppgRaw),
      buruanSae: parse(buruanRaw),
      fsva: parse(fsvaRaw)
    };
  }, []);

  // 1. PROSES POLYGON (FSVA - Paling Bawah)
  const polygonFeatures = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: datasets.fsva.map(d => {
        try {
          const feature = JSON.parse(d._geojson);
          const komposit = parseInt(d['Komposit'] || 0);
          return {
            ...feature,
            properties: {
              ...feature.properties,
              name: d.desa || 'Wilayah',
              komposit: komposit,
              category: 'FSVA'
            }
          };
        } catch (e) { return null; }
      }).filter(Boolean)
    };
  }, [datasets.fsva]);

  // 2. PROSES TITIK (Sekolah + PAUD, TK, KB + SPPG)
  const pointFeatures = useMemo(() => {
    const combined = [
      ...datasets.sekolah.map(d => ({ ...d, type: 'Sekolah' })),
      ...datasets.sppg.map(d => ({ ...d, type: 'SPPG' })),
      ...datasets.buruanSae.map(d => ({ ...d, type: 'Buruan Sae' }))
    ];

    return {
      type: 'FeatureCollection',
      features: combined.map((d, i) => {
        const keys = Object.keys(d);
        const findValue = (terms) => {
          const key = keys.find(k => terms.some(t => k.toLowerCase().trim().includes(t.toLowerCase())));
          return key ? d[key] : null;
        };

        const lng = parseFloat(String(findValue(['longitude', 'long', 'lng']) || '').replace(',', '.'));
        const lat = parseFloat(String(findValue(['latitude', 'lat']) || '').replace(',', '.'));
        if (isNaN(lng) || isNaN(lat) || lng === 0) return null;

        const category = d['Jenis Sekolah'] || d.type || 'Lainnya';
        if (selectedFilters.length > 0 && !selectedFilters.includes(category)) return null;

        return {
          type: 'Feature',
          id: i,
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: { 
            name: findValue(['namasppg', 'satuan pendidikan', 'nama_sekolah', 'nama']) || 'Tanpa Nama',
            address: findValue(['alamat', 'lokasi']) || 'Bandung',
            category: category
          }
        };
      }).filter(Boolean)
    };
  }, [datasets, selectedFilters]);

  const toggleFilter = (f) => setSelectedFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  return (
    <section className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row gap-8 h-[750px]">
        
        {/* SIDEBAR DESIGN SESUAI GAMBAR */}
        <aside className="lg:w-80 glass-card p-8 rounded-[2.5rem] bg-[#0B1221]/90 border border-white/10 flex flex-col shadow-2xl backdrop-blur-2xl overflow-hidden">
          <div className="mb-8">
            <h3 className="font-playfair text-3xl text-gold-accent font-bold italic tracking-tight">Geo-Analytic</h3>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-1">Dashboard Pemetaan</p>
          </div>

          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {/* FSVA Section */}
            <button 
              onClick={() => toggleFilter('FSVA')} 
              className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all ${selectedFilters.includes('FSVA') ? 'bg-gold-accent text-navy-dark border-gold-accent shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-white/5 border-white/5 text-white/40'}`}
            >
              <span className="text-xs font-black uppercase tracking-widest">FSVA Layer</span>
              <div className={`w-3 h-3 rounded-md ${selectedFilters.includes('FSVA') ? 'bg-navy-dark' : 'bg-white/10'}`}></div>
            </button>

            {/* Pendidikan Section */}
            <div>
              <p className="text-[9px] text-white/30 font-bold uppercase mb-4 ml-1 tracking-[0.2em]">Pendidikan</p>
              <div className="grid grid-cols-2 gap-2">
                {['PAUD', 'TK', 'KB', 'SD', 'SMP', 'SMA', 'SMK', 'MA'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => toggleFilter(cat)} 
                    className={`p-3 rounded-xl border text-[10px] font-bold transition-all ${selectedFilters.includes(cat) ? 'bg-white/10 border-gold-accent text-white' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Strategis Section */}
            <div>
              <p className="text-[9px] text-white/30 font-bold uppercase mb-4 ml-1 tracking-[0.2em]">Titik Strategis</p>
              <div className="space-y-2">
                {['SPPG', 'Buruan Sae'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => toggleFilter(cat)} 
                    className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all ${selectedFilters.includes(cat) ? 'bg-white/10 border-gold-accent text-white shadow-lg' : 'bg-white/5 border-white/5 text-white/40'}`}
                  >
                    <span className="text-xs font-bold uppercase">{cat}</span>
                    <div className={`w-2 h-2 rounded-full ${cat === 'SPPG' ? 'bg-gold-accent shadow-[0_0_8px_#d4af37]' : 'bg-[#00FF7F] shadow-[0_0_8px_#00FF7F]'}`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
             <span className="text-4xl font-black text-gold-accent leading-none tracking-tighter">{pointFeatures.features.length}</span>
             <p className="text-[9px] text-white/40 uppercase font-bold mt-2 tracking-[0.2em]">Points Identified</p>
          </div>
        </aside>

        {/* MAP AREA */}
        <div className="flex-1 rounded-[3rem] overflow-hidden frame-border relative bg-slate-950 shadow-2xl">
          <Map 
            mapLib={maplibregl} 
            initialViewState={{ longitude: 107.6191, latitude: -6.9175, zoom: 11.5, pitch: 45 }}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            onMouseMove={(e) => {
                const f = e.features?.[0];
                setHoverInfo(f ? { longitude: e.lngLat.lng, latitude: e.lngLat.lat, properties: f.properties } : null);
            }}
            interactiveLayerIds={['fsva-layer', 'pts-layer']}
          >
            {/* 1. LAYER FSVA (BAWAH) */}
            {selectedFilters.includes('FSVA') && (
              <Source id="fsva-source" type="geojson" data={polygonFeatures}>
                <Layer
                  id="fsva-layer"
                  type="fill"
                  paint={{
                    'fill-color': [
                      'match', ['get', 'komposit'],
                      2, '#b91c1c', // Ciumbuleuit
                      3, '#ef4444', // Ledeng
                      4, '#f97316', 
                      5, '#84cc16', 
                      6, '#22c55e', 
                      '#334155'
                    ],
                    'fill-opacity': 0.4,
                    'fill-outline-color': 'rgba(255,255,255,0.05)'
                  }}
                />
              </Source>
            )}

            {/* 2. LAYER TITIK (ATAS) */}
            <Source id="pts-source" type="geojson" data={pointFeatures}>
              <Layer
                id="pts-layer"
                type="circle"
                paint={{
                  'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 6],
                  'circle-color': [
                    'match', ['get', 'category'],
                    'SPPG', '#FFD700',
                    'Buruan Sae', '#00FF7F',
                    'SMA', '#FF4B2B',
                    'SMK', '#FFB75E',
                    'MA', '#A855F7',
                    'PAUD', '#EC4899',
                    'TK', '#06B6D4',
                    'KB', '#EAB308',
                    '#FFFFFF'
                  ],
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#0B1221',
                  'circle-opacity': 1
                }}
              />
            </Source>

            {/* POPUP PREMIUM SESUAI GAMBAR */}
            {hoverInfo && (
              <Popup longitude={hoverInfo.longitude} latitude={hoverInfo.latitude} closeButton={false} anchor="bottom" offset={15}>
                <div className="p-4 bg-[#0B1221]/95 border border-gold-accent/30 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] text-white backdrop-blur-xl min-w-[180px]">
                  <p className="text-gold-accent text-[8px] font-black uppercase tracking-[0.2em] mb-2 border-b border-white/10 pb-2">
                    {hoverInfo.properties.category}
                  </p>
                  <p className="text-xs font-bold leading-snug mb-2">
                    {hoverInfo.properties.name}
                  </p>
                  <div className="flex items-start gap-2 text-white/40">
                    <i className="fas fa-map-marker-alt text-[8px] mt-1"></i>
                    <p className="text-[9px] italic leading-tight">
                      {hoverInfo.properties.address || 'Bandung, Jawa Barat'}
                    </p>
                  </div>
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </section>
  );
}