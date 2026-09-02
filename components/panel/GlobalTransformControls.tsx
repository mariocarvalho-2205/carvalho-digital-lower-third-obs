import React from 'react';
import { GlobalTransformConfig } from '../../types/overlay';
import { Move, Maximize2 } from 'lucide-react';

interface GlobalTransformControlsProps {
  config?: GlobalTransformConfig;
  onChange: (transform: GlobalTransformConfig, commit?: boolean) => void;
}

export function GlobalTransformControls({ config, onChange }: GlobalTransformControlsProps) {
  const currentConfig: GlobalTransformConfig = config || { x: 0, y: 0, scale: 1 };

  const handlePropChange = (key: keyof GlobalTransformConfig, value: number) => {
    onChange({
      ...currentConfig,
      [key]: value
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-5">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Move className="w-4 h-4 text-blue-500" />
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ajuste Geral de Posição & Escala</h3>
      </div>

      {/* Global Scale Slider */}
      <div className="flex flex-col gap-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            Tamanho Geral / Escala ({Math.round(currentConfig.scale * 100)}%)
          </label>
          <button
            type="button"
            onClick={() => handlePropChange('scale', 1)}
            className="text-[10px] text-slate-500 hover:text-blue-400 font-mono transition-colors"
          >
            Reset (100%)
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.05"
            value={currentConfig.scale}
            onChange={(e) => handlePropChange('scale', parseFloat(e.target.value) || 1)}
            className="flex-1 h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <input
            type="number"
            step="0.05"
            min="0.1"
            max="3"
            value={currentConfig.scale}
            onChange={(e) => handlePropChange('scale', parseFloat(e.target.value) || 1)}
            className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono text-center focus:outline-none focus:border-blue-500"
          />
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Redimensiona todos os elementos visuais, caixas e textos de forma proporcional simultaneamente.
        </p>
      </div>

      {/* Global Offsets X & Y */}
      <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-400 font-medium">Mover X (px)</label>
            <button
              type="button"
              onClick={() => handlePropChange('x', 0)}
              className="text-[9px] text-slate-600 hover:text-slate-400 font-mono"
            >
              Reset (0)
            </button>
          </div>
          <input
            type="number"
            value={currentConfig.x}
            onChange={(e) => handlePropChange('x', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            placeholder="Ex: 50 ou -50"
          />
          <span className="text-[9px] text-slate-500">Valores positivos movem para a direita</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-400 font-medium">Mover Y (px)</label>
            <button
              type="button"
              onClick={() => handlePropChange('y', 0)}
              className="text-[9px] text-slate-600 hover:text-slate-400 font-mono"
            >
              Reset (0)
            </button>
          </div>
          <input
            type="number"
            value={currentConfig.y}
            onChange={(e) => handlePropChange('y', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            placeholder="Ex: -30 ou 30"
          />
          <span className="text-[9px] text-slate-500">Valores negativos movem para cima</span>
        </div>
      </div>
    </div>
  );
}
