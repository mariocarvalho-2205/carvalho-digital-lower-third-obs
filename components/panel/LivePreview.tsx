'use client';

import React, { useState } from 'react';
import { LowerThird } from '@/components/overlay/LowerThird';
import { OverlayConfig, VariationData } from '@/types/overlay';
import { Image as ImageIcon, Eye, EyeOff, Trash2, Upload } from 'lucide-react';

interface LivePreviewProps {
  config: OverlayConfig;
  variations: VariationData[];
  isActive: boolean;
  isPreviewActive: boolean;
  activeVariationId: string | null;
}

export function LivePreview({
  config,
  variations,
  isActive,
  isPreviewActive,
  activeVariationId
}: LivePreviewProps) {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceOpacity, setReferenceOpacity] = useState<number>(0.5);
  const [referenceVisible, setReferenceVisible] = useState<boolean>(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedImage = localStorage.getItem(`referenceImage_${config.canvas.width}x${config.canvas.height}`);
      if (savedImage) setReferenceImage(savedImage);

      const savedOpacity = localStorage.getItem('referenceOpacity');
      if (savedOpacity) setReferenceOpacity(parseFloat(savedOpacity));

      const savedVisible = localStorage.getItem('referenceVisible');
      if (savedVisible) setReferenceVisible(savedVisible === 'true');
    }
  }, [config.canvas.width, config.canvas.height]);

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const resultString = event.target.result as string;
        setReferenceImage(resultString);
        setReferenceVisible(true);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`referenceImage_${config.canvas.width}x${config.canvas.height}`, resultString);
            localStorage.setItem('referenceVisible', 'true');
          } catch (e) {
            console.warn('Não foi possível salvar a imagem no localStorage (pode ser muito grande)', e);
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveReference = () => {
    setReferenceImage(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`referenceImage_${config.canvas.width}x${config.canvas.height}`);
    }
  };

  const handleOpacityChange = (value: number) => {
    setReferenceOpacity(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('referenceOpacity', value.toString());
    }
  };

  const handleVisibleChange = (value: boolean) => {
    setReferenceVisible(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('referenceVisible', value.toString());
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Live Preview</h2>
          <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-mono">1920x1080</span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
            {isActive ? 'AO VIVO' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex items-center justify-center group">
        {/* Transparent checkerboard background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#475569 1px, transparent 1px), radial-gradient(#475569 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px'
          }}
        />

        {/* Reference Model Image Layer (Local Only - Never sent to OBS) */}
        {referenceImage && referenceVisible && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `url(${referenceImage})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: referenceOpacity
            }}
          />
        )}

        {/* The visual lower third scale wrapper */}
        <div className="w-full h-full relative z-10" style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
          {activeVariationId !== null ? (
            (() => {
              const currentVar = variations?.find((v) => v.id === activeVariationId);
              if (!currentVar) return null;
              const subConfig = {
                ...config,
                ...currentVar.config,
                canvas: config.canvas,
                animation: config.animation,
              };
              return <LowerThird config={subConfig} isActive={isPreviewActive} isPreview={true} />;
            })()
          ) : (
            variations?.map((variation) => {
              const subConfig = {
                ...config,
                ...variation.config,
                canvas: config.canvas,
                animation: config.animation,
              };
              return (
                <div key={variation.id} className="absolute inset-0 pointer-events-none">
                  <LowerThird config={subConfig} isActive={isPreviewActive && variation.is_active} isPreview={true} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Reference Model Image Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-300">Modelo Guia (Gabarito):</span>
        </div>

        {referenceImage ? (
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Opacidade ({Math.round(referenceOpacity * 100)}%)</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={referenceOpacity}
                onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                className="w-20 h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => handleVisibleChange(!referenceVisible)}
              className={`p-1.5 rounded border transition-colors flex items-center gap-1 text-[11px] ${
                referenceVisible
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
              title={referenceVisible ? "Ocultar modelo" : "Exibir modelo"}
            >
              {referenceVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {referenceVisible ? 'Visível' : 'Oculto'}
            </button>

            <button
              type="button"
              onClick={handleRemoveReference}
              className="p-1.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors flex items-center gap-1 text-[11px]"
              title="Remover modelo do preview"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remover
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-1.5 py-1 px-3 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 cursor-pointer transition-colors text-xs font-medium">
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            Carregar Imagem de Modelo (Guia)
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleReferenceUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
}
