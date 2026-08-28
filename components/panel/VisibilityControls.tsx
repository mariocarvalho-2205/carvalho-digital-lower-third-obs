import React from 'react';

interface VisibilityControlsProps {
  isActive: boolean;
  onToggle: () => void;
  isPreviewActive: boolean;
  onTogglePreview: () => void;
}

export function VisibilityControls({
  isActive,
  onToggle,
  isPreviewActive,
  onTogglePreview,
}: VisibilityControlsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Controle de Exibição</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onToggle}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 border ${
            isActive
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-slate-950 animate-ping' : 'bg-slate-500'}`} />
          {isActive ? 'OBS: ON' : 'OBS: OFF'}
        </button>
        <button
          onClick={onTogglePreview}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 border ${
            isPreviewActive
              ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isPreviewActive ? 'bg-blue-400 animate-pulse' : 'bg-slate-500'}`} />
          {isPreviewActive ? 'PREVIEW: ON' : 'PREVIEW: OFF'}
        </button>
      </div>
    </div>
  );
}

