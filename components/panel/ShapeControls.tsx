import React from 'react';
import { BarConfig, ContentBoxConfig } from '../../types/overlay';

interface ShapeControlsProps {
  label: string;
  config: BarConfig | ContentBoxConfig;
  onChange: (shape: any) => void;
}

export function ShapeControls({ label, config, onChange }: ShapeControlsProps) {
  const updateProp = (key: string, value: any) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  const updateRadius = (key: string, value: number) => {
    onChange({
      ...config,
      radius: {
        ...((config as any).radius || { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 }),
        [key]: value
      }
    });
  };

  const isBarConfig = (cfg: any): cfg is BarConfig => {
    return 'background' in cfg && typeof cfg.background === 'object';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</h3>
      
      {/* Position and Size */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-medium">Posição X (px)</label>
          <input
            type="number"
            value={config.x}
            onChange={(e) => updateProp('x', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-medium">Posição Y (px)</label>
          <input
            type="number"
            value={config.y}
            onChange={(e) => updateProp('y', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-medium">Largura (px)</label>
          <input
            type="number"
            value={config.width}
            onChange={(e) => updateProp('width', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-medium">Altura (px)</label>
          <input
            type="number"
            value={config.height}
            onChange={(e) => updateProp('height', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Colors and Background details */}
      {isBarConfig(config) ? (
        <div className="flex flex-col gap-3 border-t border-slate-800/60 pt-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-medium">Tipo de Fundo</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateProp('background', { ...config.background, type: 'solid' })}
                className={`py-1 px-2 text-xs font-semibold rounded border ${
                  config.background.type === 'solid' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Sólido
              </button>
              <button
                type="button"
                onClick={() => updateProp('background', { ...config.background, type: 'gradient', direction: 'right' })}
                className={`py-1 px-2 text-xs font-semibold rounded border ${
                  config.background.type === 'gradient' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Gradiente
              </button>
            </div>
          </div>

          {config.background.type === 'solid' ? (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-medium">Cor</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={config.background.color || '#000000'}
                  onChange={(e) => updateProp('background', { ...config.background, color: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={config.background.color || ''}
                  onChange={(e) => updateProp('background', { ...config.background, color: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-medium">Cor Inicial</label>
                  <input
                    type="color"
                    value={config.background.start || '#000000'}
                    onChange={(e) => updateProp('background', { ...config.background, start: e.target.value })}
                    className="w-full h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-medium">Cor Final</label>
                  <input
                    type="color"
                    value={config.background.end || '#000000'}
                    onChange={(e) => updateProp('background', { ...config.background, end: e.target.value })}
                    className="w-full h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-medium">Direção</label>
                <select
                  value={config.background.direction || 'right'}
                  onChange={(e) => updateProp('background', { ...config.background, direction: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none"
                >
                  <option value="right">Para a Direita</option>
                  <option value="left">Para a Esquerda</option>
                  <option value="top">Para Cima</option>
                  <option value="bottom">Para Baixo</option>
                </select>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 border-t border-slate-800/60 pt-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-medium">Cor de Fundo</label>
            <input
              type="color"
              value={typeof config.background === 'string' ? config.background : '#000000'}
              onChange={(e) => updateProp('background', e.target.value)}
              className="w-full h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-medium">Opacidade ({Math.round(config.opacity * 100)}%)</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.opacity}
              onChange={(e) => updateProp('opacity', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      )}

      {/* Border Radius independent controls */}
      <div className="flex flex-col gap-2 border-t border-slate-800/60 pt-3">
        <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Arredondamento dos Cantos (px)</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-slate-500">Sup. Esquerdo</label>
            <input
              type="number"
              value={config.radius?.topLeft || 0}
              onChange={(e) => updateRadius('topLeft', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-slate-500">Sup. Direito</label>
            <input
              type="number"
              value={config.radius?.topRight || 0}
              onChange={(e) => updateRadius('topRight', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-slate-500">Inf. Direito</label>
            <input
              type="number"
              value={config.radius?.bottomRight || 0}
              onChange={(e) => updateRadius('bottomRight', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-slate-500">Inf. Esquerdo</label>
            <input
              type="number"
              value={config.radius?.bottomLeft || 0}
              onChange={(e) => updateRadius('bottomLeft', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
