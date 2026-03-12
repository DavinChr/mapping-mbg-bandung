import React, { useState, useMemo } from 'react';
import { Map, Source, Layer } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import Papa from 'papaparse';
import 'maplibre-gl/dist/maplibre-gl.css';

import sekolahRaw from '../data/sekolah.csv?raw';
import sppgRaw from '../data/sppg.csv?raw';
import graphRaw from '../data/SPPG_Sekolah.csv?raw';

export default function AdminDashboard() {
  // Filter terpisah agar rapi
  const [showHeatmapSekolah, setShowHeatmapSekolah] = useState(true);
  const [showHeatmapSPPG, setShowHeatmapSPPG] = useState(true);
  const [showGraph, setShowGraph] = useState(true);

  const datasets = useMemo(() => {
    const parse = (raw) => raw ? Papa.parse(raw, { header: true, skipEmptyLines: true }).data : [];
    return {
      sekolah: parse(sekolahRaw),
      sppg: parse(sppgRaw),
      graph: parse(graphRaw)
    };
  }, []);

  const pointFeatures = useMemo(() => {
    const combined = [
      ...datasets.sekolah.map(d => ({ ...d, category: 'Sekolah' })), 
      ...datasets.sppg.map(d => ({ ...d, category: 'SPPG' }))
    ];
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
          properties: { category: d.category }
        };
      }).filter(Boolean)
    };
  }, [datasets]);

  // FIX GARIS: Deteksi kolom anti-gagal
  const lineFeatures = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: datasets.graph.map(d => {
        const keys = Object.keys(d);
        const getVal = (terms) => d[keys.find(k => terms.some(t => k.toLowerCase().includes(t)))];

        // Pastikan nama kolom di CSV mengandung kata-kata ini
        const lng1 = parseFloat(getVal(['long_sppg', 'lng_sppg']));
        const lat1 = parseFloat(getVal(['lat_sppg']));
        const lng2 = parseFloat(getVal(['long_sekolah', 'lng_sekolah']));
        const lat2 = parseFloat(getVal(['lat_sekolah']));

        if (isNaN(lng1) || isNaN(lat1) || isNaN(lng2) || isNaN(lat2)) return null;

        return {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [[lng1, lat1], [lng2, lat2]] }
        };
      }).filter(Boolean)
    };
  }, [datasets.graph]);

  return (
    <div className="h-screen w-full flex flex-col bg-[#0B1221] text-white font-sans overflow-hidden">
      <header className="h-20 px-10 flex items-center justify-between border-b border-white/10 bg-[#0B1221] z-30">
        <h1 className="font-playfair text-xl font-bold italic text-gold-accent">DSS Admin Analysis</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} className="text-red-500 text-xs font-bold border border-red-500/20 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all">LOGOUT</button>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-80 border-r border-white/5 p-8 flex flex-col bg-[#0B1221]/80 backdrop-blur-xl">
          <p className="text-[10px] font-black text-gold-accent uppercase tracking-widest mb-4">Visual Controls</p>
          <div className="space-y-4">
            
            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:border-gold-accent/30">
              <span className="text-xs font-bold text-orange-500">Heatmap Sekolah</span>
              <input type="checkbox" checked={showHeatmapSekolah} onChange={() => setShowHeatmapSekolah(!showHeatmapSekolah)} className="w-5 h-5 accent-orange-500" />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:border-gold-accent/30">
              <span className="text-xs font-bold text-gold-accent">Heatmap SPPG</span>
              <input type="checkbox" checked={showHeatmapSPPG} onChange={() => setShowHeatmapSPPG(!showHeatmapSPPG)} className="w-5 h-5 accent-gold-accent" />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:border-gold-accent/30">
              <span className="text-xs font-bold text-green-400">Garis Distribusi</span>
              <input type="checkbox" checked={showGraph} onChange={() => setShowGraph(!showGraph)} className="w-5 h-5 accent-green-500" />
            </label>

          </div>
        </aside>

        {/* MAP */}
        <div className="flex-1 relative">
          <Map 
            mapLib={maplibregl} 
            initialViewState={{ longitude: 107.6191, latitude: -6.9175, zoom: 11.8 }}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          >
            {/* GARIS DISTRIBUSI */}
            {showGraph && (
              <Source id="graph-src" type="geojson" data={lineFeatures}>
                <Layer 
                  id="graph-lines" 
                  type="line" 
                  paint={{ 'line-color': '#00FF7F', 'line-width': 2, 'line-opacity': 0.8, 'line-dasharray': [2, 2] }} 
                />
              </Source>
            )}

            {/* TITIK & HEATMAP */}
            <Source id="pts-src" type="geojson" data={pointFeatures}>
              
              {/* Heatmap SPPG */}
              {showHeatmapSPPG && (
                <Layer 
                  id="heat-sppg" type="heatmap" filter={['==', 'category', 'SPPG']}
                  paint={{ 'heatmap-weight': 1, 'heatmap-intensity': 2, 'heatmap-radius': 35, 'heatmap-opacity': 0.8, 'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0,0,0,0)', 0.5, 'rgba(212,175,55,0.5)', 1, '#FFD700'] }} 
                />
              )}

              {/* Heatmap Sekolah */}
              {showHeatmapSekolah && (
                <Layer 
                  id="heat-sekolah" type="heatmap" filter={['==', 'category', 'Sekolah']}
                  paint={{ 'heatmap-weight': 1, 'heatmap-intensity': 2, 'heatmap-radius': 25, 'heatmap-opacity': 0.6, 'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0,0,0,0)', 0.5, 'rgba(236,91,19,0.5)', 1, '#ec5b13'] }} 
                />
              )}

              <Layer id="pts" type="circle" paint={{ 'circle-radius': 3, 'circle-color': ['match', ['get', 'category'], 'SPPG', '#FFD700', '#ec5b13'] }} />
            </Source>
          </Map>
        </div>
      </main>
    </div>
  );
}