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
  const [selectedFilters, setSelectedFilters] = useState(['SMA', 'SMK', 'MA', 'PAUD', 'TK', 'KB', 'SPPG', 'Buruan Sae', 'FSVA', 'SD', 'SMP']);
  const [hoverInfo, setHoverInfo] = useState(null);

  // 1. Parsing Data Secara Aman
  const datasets = useMemo(() => {
    const parseData = (raw) => {
      if (!raw) return [];
      try {
        return Papa.parse(raw, { header: true, skipEmptyLines: true }).data || [];
      } catch (e) {
        console.error("CSV Parse Error:", e);
        return [];
      }
    };
    return {
      sekolah: parseData(sekolahRaw),
      sppg: parseData(sppgRaw),
      buruanSae: parseData(buruanRaw),
      fsva: parseData(fsvaRaw)
    };
  }, []);

  // 2. FSVA Polygon Processing (Super Safe)
  const polygonFeatures = useMemo(() => {
    if (!datasets.fsva.length) return { type: 'FeatureCollection', features: [] };

    const features = datasets.fsva.map(d => {
      if (!d._geojson) return null;
      try {
        const feature = JSON.parse(d._geojson);
        if (!feature || !feature.type || feature.type !== 'Feature') return null; // Harus valid Feature

        return {
          ...feature,
          properties: {
            ...feature.properties,
            name: d.desa || 'Wilayah',
            komposit: parseInt(d.Komposit || 0, 10),
            category: 'FSVA'
          }
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    return { type: 'FeatureCollection', features };
  }, [datasets.fsva]);

  // 3. Points Processing (Super Safe)
  const pointFeatures = useMemo(() => {
    const combined = [
      ...datasets.sekolah.map(d => ({ ...d, defaultCategory: d['Jenis Sekolah'] || 'Sekolah' })),
      ...datasets.sppg.map(d => ({ ...d, defaultCategory: 'SPPG' })),
      ...datasets.buruanSae.map(d => ({ ...d, defaultCategory: 'Buruan Sae' }))
    ];

    if (!combined.length) return { type: 'FeatureCollection', features: [] };

    const features = combined.map((d, i) => {
      const keys = Object.keys(d);
      const findKey = (terms) => keys.find(k => terms.some(t => k.toLowerCase().trim().includes(t.toLowerCase())));

      const lngKey = findKey(['longitude', 'long', 'lng']);
      const latKey = findKey(['latitude', 'lat']);

      if (!lngKey || !latKey) return null;

      const lng = parseFloat(String(d[lngKey]).replace(',', '.'));
      const lat = parseFloat(String(d[latKey]).replace(',', '.'));

      if (isNaN(lng) || isNaN(lat)) return null;

      const category = d.defaultCategory;
      if (selectedFilters.length > 0 && !selectedFilters.includes(category)) return null;

      const nameKey = findKey(['namasppg', 'satuan pendidikan', 'nama_sekolah', 'nama']);
      const addressKey = findKey(['alamat', 'lokasi']);

      return {
        type: 'Feature',
        id: i,
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {
          name: nameKey ? d[nameKey] : 'Tanpa Nama',
          address: addressKey ? d[addressKey] : 'Bandung',
          category: category
        }
      };
    }).filter(Boolean);

    return { type: 'FeatureCollection', features };
  }, [datasets, selectedFilters]);

  const toggleFilter = (f) => setSelectedFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  return (
    <div className="w-full h-full relative font-sans">
      <Map
        mapLib={maplibregl}
        initialViewState={{ longitude: 107.6191, latitude: -6.9175, zoom: 11.5, pitch: 40 }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        onMouseMove={(e) => {
          const f = e.features?.[0];
          setHoverInfo(f ? { longitude: e.lngLat.lng, latitude: e.lngLat.lat, properties: f.properties } : null);
        }}
        interactiveLayerIds={['fsva-layer', 'pts-layer']}
        style={{ width: '100%', height: '100%' }}
      >
        {selectedFilters.includes('FSVA') && polygonFeatures.features.length > 0 && (
          <Source id="fsva-source" type="geojson" data={polygonFeatures}>
            <Layer
              id="fsva-layer"
              type="fill"
              paint={{
                'fill-color': [
                  'match', ['get', 'komposit'],
                  2, '#b91c1c', 3, '#ef4444', 4, '#f97316', 5, '#84cc16', 6, '#22c55e', '#334155'
                ],
                'fill-opacity': 0.35,
                'fill-outline-color': 'rgba(255,255,255,0.1)'
              }}
            />
          </Source>
        )}

        {pointFeatures.features.length > 0 && (
          <Source id="pts-source" type="geojson" data={pointFeatures}>
            <Layer
              id="pts-layer"
              type="circle"
              paint={{
                'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 2.5, 15, 8],
                'circle-color': [
                  'match', ['get', 'category'],
                  'SD', '#3B82F6',        // Biru untuk SD
                  'SMP', '#6366F1',       // Indigo untuk SMP
                  'SMA', '#FF4B2B',
                  'SPPG', '#D4AF37',      // Emas untuk SPPG
                  'Buruan Sae', '#00FF7F',
                  'PAUD', '#EC4899',
                  'TK', '#06B6D4',
                  '#FFFFFF'
                ],
                'circle-stroke-width': 1.5,
                'circle-stroke-color': '#0B1221',
                'circle-opacity': 0.9
              }}
            />
          </Source>
        )}

        {hoverInfo && (
          <Popup longitude={hoverInfo.longitude} latitude={hoverInfo.latitude} closeButton={false} anchor="bottom" offset={15}>
            <div className="p-4 bg-[#0B1221]/95 border border-[#D4AF37]/30 rounded-2xl shadow-2xl text-white backdrop-blur-xl min-w-[200px]">
              <p className="text-[#D4AF37] text-[8px] font-black uppercase tracking-[0.2em] mb-2 border-b border-white/10 pb-2">
                {hoverInfo.properties.category}
              </p>
              <p className="text-xs font-bold leading-snug mb-2">{hoverInfo.properties.name}</p>
              <p className="text-[9px] italic leading-tight text-white/40">{hoverInfo.properties.address}</p>
            </div>
          </Popup>
        )}
      </Map>

      {/* --- SIDEBAR --- */}
      <aside className="absolute top-8 left-8 z-10 w-72 max-h-[calc(100%-4rem)] p-6 rounded-[2.5rem] bg-[#0B1221]/40 border border-white/20 flex flex-col shadow-2xl backdrop-blur-xl overflow-hidden glass-card">
        <div className="mb-6">
          <h3 className="font-playfair text-2xl text-[#D4AF37] font-bold italic">Geo-Analytic</h3>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] mt-1">Sistem Informasi MBG</p>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
          <button onClick={() => toggleFilter('FSVA')} className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all ${selectedFilters.includes('FSVA') ? 'bg-[#D4AF37] text-[#0B1221] border-[#D4AF37]' : 'bg-white/5 border-white/5 text-white/40'}`}>
            <span className="text-[10px] font-black uppercase tracking-widest">Peta Ketahanan</span>
            <div className={`w-3 h-3 rounded-md ${selectedFilters.includes('FSVA') ? 'bg-[#0B1221]' : 'bg-white/10'}`}></div>
          </button>

          <div>
            <p className="text-[8px] text-white/20 font-black uppercase mb-3 ml-1 tracking-[0.2em]">Pendidikan</p>
            <div className="grid grid-cols-2 gap-2">
              {['SD', 'SMP', 'SMA', 'SMK', 'PAUD', 'TK'].map(cat => (
                <button key={cat} onClick={() => toggleFilter(cat)} className={`p-2 rounded-xl border text-[9px] font-black transition-all ${selectedFilters.includes(cat) ? 'bg-white/10 border-[#D4AF37]/50 text-white' : 'bg-white/5 border-white/5 text-white/30'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[8px] text-white/20 font-black uppercase mb-3 ml-1 tracking-[0.2em]">Titik Strategis</p>
            <div className="space-y-2">
              {['SPPG', 'Buruan Sae'].map(cat => (
                <button key={cat} onClick={() => toggleFilter(cat)} className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${selectedFilters.includes(cat) ? 'bg-white/10 border-[#D4AF37] text-white' : 'bg-white/5 border-white/5 text-white/30'}`}>
                  <span className="text-[10px] font-bold uppercase">{cat}</span>
                  <div className={`w-2 h-2 rounded-full ${cat === 'SPPG' ? 'bg-[#D4AF37]' : 'bg-[#00FF7F]'}`}></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}