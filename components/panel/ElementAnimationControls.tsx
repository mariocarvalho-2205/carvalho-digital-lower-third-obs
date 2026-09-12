'use client';

import React from 'react';
import { ElementAnimationConfig } from '../../types/overlay';
import { Play } from 'lucide-react';

interface ElementAnimationControlsProps {
  config?: ElementAnimationConfig;
  onChange: (anim: ElementAnimationConfig, commit?: boolean) => void;
  onTest?: (isTesting: boolean) => void;
}

const DEFAULT_CONFIG: ElementAnimationConfig = {
  enabled: false,
  enter: 'none',
  exit: 'none',
  duration: 500,
  delay: 0,
};

export function ElementAnimationControls({ config, onChange, onTest }: ElementAnimationControlsProps) {
  const currentConfig = config || DEFAULT_CONFIG;
  const [isTesting, setIsTesting] = React.useState(false);

  const handlePropChange = (key: string, value: any, commit = true) => {
    onChange({
      ...currentConfig,
      [key]: value
    }, commit);
  };

  const anims = [
    { value: 'none', label: 'Nenhuma' },
    { value: 'wipe-right', label: 'Revelar p/ Direita' },
    { value: 'wipe-left', label: 'Revelar p/ Esquerda' },
    { value: 'wipe-down', label: 'Revelar p/ Baixo' },
    { value: 'wipe-up', label: 'Revelar p/ Cima' },
    { value: 'fade', label: 'Fade' },
    { value: 'spin-cw', label: 'Girar (Horário)' },
    { value: 'spin-ccw', label: 'Girar (Anti-Horário)' },
  ];

  return (
    <div className="flex flex-col gap-4 border-t border-slate-800/60 pt-4 mt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-indigo-400" />
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Animação Individual</h3>
        </div>
        
        <button
          onClick={() => handlePropChange('enabled', !currentConfig.enabled)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all duration-200 ${
            currentConfig.enabled
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${currentConfig.enabled ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500'}`} />
          {currentConfig.enabled ? 'ATIVADA' : 'DESATIVADA'}
        </button>
      </div>

      <div className={`flex flex-col gap-4 transition-all duration-200 ${!currentConfig.enabled ? 'opacity-40 pointer-events-none select-none h-0 overflow-hidden' : ''}`}>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-medium">Entrada</label>
            <select
              value={currentConfig.enter}
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
              value={currentConfig.exit}
              onChange={(e) => handlePropChange('exit', e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none"
            >
              {anims.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-medium">Duração ({currentConfig.duration}ms)</label>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={currentConfig.duration}
              onChange={(e) => handlePropChange('duration', parseInt(e.target.value) || 500, false)}
              onBlur={(e) => handlePropChange('duration', parseInt(e.target.value) || 500, true)}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-medium">Atraso ({currentConfig.delay}ms)</label>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={currentConfig.delay}
              onChange={(e) => handlePropChange('delay', parseInt(e.target.value) || 0, false)}
              onBlur={(e) => handlePropChange('delay', parseInt(e.target.value) || 0, true)}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={() => {
            const newTestingState = !isTesting;
            setIsTesting(newTestingState);
            if (onTest) onTest(newTestingState);
          }}
          disabled={!currentConfig.enabled}
          className={`w-full py-2 rounded-lg text-[11px] font-bold border transition-all flex items-center justify-center gap-2 mt-2 ${
            isTesting 
              ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> 
          {isTesting ? 'REVERTER ANIMAÇÃO INDIVIDUAL' : 'TESTAR ANIMAÇÃO INDIVIDUAL'}
        </button>
      </div>
    </div>
  );
}
