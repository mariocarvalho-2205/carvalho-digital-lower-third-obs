'use client';

import React from 'react';
import { useOverlay } from '@/hooks/useOverlay';
import { useOverlayRealtime } from '@/hooks/useOverlayRealtime';
import { ControlPanel } from '@/components/panel/ControlPanel';
import { useParams } from 'next/navigation';
import { LayoutGrid, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PainelPage() {
  const params = useParams();
  const slug = params?.slug as string || 'ba-ao-vivo';

  const { overlay, setOverlay, loading, error, updateOverlay } = useOverlay(slug);

  // Subscribe to real-time changes so external edits are immediately visible in the form
  useOverlayRealtime(slug, (newOverlay) => {
    setOverlay(newOverlay);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/20">
      {/* Header bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-500" />
            <h1 className="text-base font-bold tracking-tight text-white capitalize">
              {slug.replace(/-/g, ' ')}
            </h1>
            <span className="text-[10px] text-slate-500 font-mono">/painel/{slug}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Supabase Realtime Conectado
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-sm">
            <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin" />
            Carregando configurações do painel...
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-6 text-sm flex flex-col gap-2">
            <h4 className="font-bold">Ocorreu um erro ao carregar o painel:</h4>
            <code className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-rose-300 font-mono text-xs">{error}</code>
            <p className="text-slate-500 text-xs mt-2">Certifique-se de configurar as variáveis no arquivo .env.local e executar o script SQL no Supabase.</p>
          </div>
        ) : overlay ? (
          <ControlPanel
            overlay={overlay}
            onUpdate={updateOverlay}
            slug={slug}
          />
        ) : null}
      </main>
    </div>
  );
}
