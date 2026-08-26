'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, Plus, Monitor, ArrowUpRight, Radio, ExternalLink } from 'lucide-react';

export default function Home() {
  const [slugs, setSlugs] = useState<string[]>(['ba-ao-vivo', 'esportes', 'entrevista']);
  const [newSlug, setNewSlug] = useState('');

  const handleAddOverlay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug.trim()) return;
    const formatted = newSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
    
    if (formatted && !slugs.includes(formatted)) {
      setSlugs([...slugs, formatted]);
      setNewSlug('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/20">
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col gap-8 justify-center">
        {/* Hero section */}
        <div className="flex flex-col gap-3 text-center md:text-left">
          <div className="inline-flex self-center md:self-start items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Lower Thirds para Streamings
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-1">
            Carvalho Digital <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Lower Thirds</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl">
            Crie, customize e controle sobreposições de forma remota em tempo real via Supabase Realtime para seu OBS Studio ou vMix.
          </p>
        </div>

        {/* Dashboard grid */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Suas Overlays Ativas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slugs.map((slug) => (
              <div key={slug} className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700/80 transition-all duration-300 flex flex-col gap-4 group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white capitalize text-lg">{slug.replace(/-/g, ' ')}</h3>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">slug: {slug}</p>
                  </div>
                  <span className="p-2 rounded-lg bg-slate-950 text-slate-400 group-hover:text-blue-400 transition-colors border border-slate-850">
                    <Monitor className="w-4 h-4" />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link
                    href={`/painel/${slug}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all border border-blue-500"
                  >
                    Painel
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/overlay/${slug}`}
                    target="_blank"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-lg text-xs font-semibold transition-all border border-slate-805"
                  >
                    Overlay
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add new overlay item */}
        <form onSubmit={handleAddOverlay} className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Criar Nova Overlay</h3>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
              placeholder="Ex: nova-campanha-ao-vivo"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-600/10"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
