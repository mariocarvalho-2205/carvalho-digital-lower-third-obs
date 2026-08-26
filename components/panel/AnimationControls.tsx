import React from 'react';
import { AnimationConfig } from '../../types/overlay';

interface AnimationControlsProps {
  config: AnimationConfig;
  onChange: (anim: AnimationConfig) => void;
}

export function AnimationControls({ config, onChange }: AnimationControlsProps) {
  const handlePropChange = (key: string, value: any) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  const anims = [
    { value: 'fade', label: 'Desvanecer (Fade)' },
    { value: 'slide-left', label: 'Deslizar Esquerda' },
    { value: 'slide-right', label: 'Deslizar Direita' },
    { value: 'slide-up', label: 'Deslizar de Baixo' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transições & Animações</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-medium">Entrada</label>
          <select
            value={config.enter}
            onChange={(e) => handlePropChange('enter', e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none"
          >
            {anims.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-medium">Saída</label>
          <select
            value={config.exit}
            onChange={(e) => handlePropChange('exit', e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none"
          >
            {anims.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t border-slate-800/60 pt-3">
        <label className="text-[10px] text-slate-400 font-medium">Duração ({config.duration}ms)</label>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={config.duration}
          onChange={(e) => handlePropChange('duration', parseInt(e.target.value) || 500)}
          className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  );
}
