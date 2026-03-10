import React, { useState, useMemo } from 'react';
import { Map, Source, Layer, Popup } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import Papa from 'papaparse';
import * as turf from '@turf/turf'; 
import 'maplibre-gl/dist/maplibre-gl.css';

// --- IMPORT DATA ---
import sekolahRaw from '../data/sekolah.csv?raw';
import sppgRaw from '../data/sppg.csv?raw';

export default function AdminDashboard() {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRadar, setShowRadar] = useState(false);
  const centerBandung = [107.6191, -6.9175];

  const datasets = useMemo(() => {
    const parse = (raw) => Papa.parse(raw, { header: true, skipEmptyLines: true }).data;
    return {
      sekolah: parse(sekolahRaw) || [],
      sppg: parse(sppgRaw) || []
    };
  }, []);

  const pointFeatures = useMemo(() => {
    const combined = [...datasets.sekolah, ...datasets.sppg];
    return {
      type: 'FeatureCollection',
      features: combined.map((d, i) => {
        const keys = Object.keys(d);
        const findValue = (t) => d[keys.find(k => k.toLowerCase().trim().includes(t))];
        const lng = parseFloat(String(findValue('long') || '').replace(',', '.'));
        const lat = parseFloat(String(findValue('lat') || '').replace(',', '.'));
        if (isNaN(lng) || isNaN(lat)) return null;
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: { name: findValue('nama') || 'Tanpa Nama' }
        };
      }).filter(Boolean)
    };
  }, [datasets]);

  const radarCircle = useMemo(() => turf.circle(centerBandung, 6, { steps: 64, units: 'kilometers' }), []);

  return (
    <div className="h-screen w-full flex flex-col bg-[#0B1221] text-white overflow-hidden font-sans">
      {/* HEADER (Gaya Luxury Publik) */}
      <header className="h-20 px-10 flex items-center justify-between border-b border-white/10 bg-[#0B1221] z-30">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gold-accent rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-navy-dark font-bold">analytics</span>
          </div>
          <div>
            <h1 className="font-playfair text-xl font-bold italic text-gold-accent">DSS Admin</h1>
            <p className="text-[8px] uppercase tracking-[0.4em] text-white/30">Bandung Decision System</p>
          </div>
        </div>
        <nav className="flex items-center gap-10">
          <a href="/" className="text-[10px] font-black tracking-widest text-white/40 hover:text-gold-accent transition-all">WEBSITE VIEW</a>
          <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} className="px-6 py-2.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-black tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all">LOGOUT</button>
        </nav>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-80 border-r border-white/5 p-8 flex flex-col bg-[#0B1221]/80 backdrop-blur-xl">
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black text-gold-accent uppercase tracking-widest mb-4">Visual Controls</p>
              <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:border-gold-accent/30">
                <span className="text-xs font-bold text-white/60">Heatmap Mode</span>
                <input type="checkbox" checked={showHeatmap} onChange={() => setShowHeatmap(!showHeatmap)} className="w-5 h-5 accent-gold-accent" />
              </label>
            </div>
            <div>
              <p className="text-[10px] font-black text-gold-accent uppercase tracking-widest mb-4">Simulation</p>
              <button onClick={() => setShowRadar(!showRadar)} className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all ${showRadar ? 'bg-gold-accent text-navy-dark shadow-xl' : 'bg-white/5 text-white/30 border border-white/5'}`}>
                <span className="material-symbols-outlined">radar</span> {showRadar ? 'RADAR 6KM: ON' : 'AKTIFKAN RADAR'}
              </button>
            </div>
          </div>
        </aside>

        {/* MAP AREA */}
        <div className="flex-1 relative">
          <Map 
            mapLib={maplibregl} 
            // Ambil URL Style dari .env
            mapStyle={import.meta.env.VITE_MAP_STYLE}
            initialViewState={{ longitude: 107.6191, latitude: -6.9175, zoom: 11.5 }}
          >
            {/* Layer Radar */}
            {showRadar && (
              <Source id="radar-src" type="geojson" data={radarCircle}>
                <Layer id="radar-fill" type="fill" paint={{ 'fill-color': '#d4af37', 'fill-opacity': 0.1 }} />
                <Layer id="radar-line" type="line" paint={{ 'line-color': '#d4af37', 'line-width': 2, 'line-dasharray': [2, 1] }} />
              </Source>
            )}

            {/* Layer Data Sekolah */}
            <Source id="pts-src" type="geojson" data={pointFeatures}>
              {showHeatmap && (
                <Layer id="heat" type="heatmap" paint={{ 'heatmap-weight': 1, 'heatmap-intensity': 2, 'heatmap-radius': 25, 'heatmap-opacity': 0.6, 'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0,0,0,0)', 0.5, 'rgba(212,175,55,0.3)', 1, '#d4af37'] }} />
              )}
              <Layer id="pts" type="circle" paint={{ 'circle-radius': 3.5, 'circle-color': '#d4af37', 'circle-stroke-width': 1.5, 'circle-stroke-color': '#0B1221' }} />
            </Source>
          </Map>

          {/* INSIGHT PANEL */}
          <div className="absolute bottom-10 right-10 w-72 bg-[#0B1221]/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
             <h4 className="text-[9px] font-black uppercase tracking-widest text-gold-accent mb-4">Admin Insights</h4>
             <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-bold text-white/20 uppercase mb-1">Total Monitoring</p>
                  <p className="text-xl font-black text-white">{pointFeatures.features.length} <span className="text-xs font-normal text-white/30">Nodes</span></p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-bold text-gold-accent/80 tracking-widest">SYSTEM SECURE</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}