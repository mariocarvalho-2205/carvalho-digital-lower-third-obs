import React, { useState, useEffect } from 'react';
import { TextsConfig, TextPropertyConfig, TextColor, TextColorSolid, TextColorLinear, TextColorRadial } from '../../types/overlay';
import { createClient } from '../../lib/supabase/client';

interface TextControlsProps {
  config: TextsConfig;
  onChange: (texts: TextsConfig, commit?: boolean) => void;
  slug?: string;
}

const POPULAR_FONTS = [
  'Arial',
  'Inter',
  'Roboto',
  'Montserrat',
  'Poppins',
  'Oswald',
  'Open Sans',
  'Impact',
  'Trebuchet MS',
  'Georgia'
];

const FONT_WEIGHTS = [
  { label: 'Normal (400)', value: 400 },
  { label: 'Médio (500)', value: 500 },
  { label: 'Semi-Bold (600)', value: 600 },
  { label: 'Negrito (700)', value: 700 },
  { label: 'Extra-Bold (800)', value: 800 },
  { label: 'Black (900)', value: 900 }
];

type TextSection = 'topText' | 'title' | 'subtitle' | 'bottomText';

export function TextControls({ config, onChange, slug = 'default' }: TextControlsProps) {
  const [activeSection, setActiveSection] = useState<TextSection>('title');
  const [uploadingSeparator, setUploadingSeparator] = useState(false);
  const supabase = createClient();

  const targetConfig: TextPropertyConfig = config[activeSection] || {
    content: '',
    x: 0,
    y: 0,
    fontSize: 20,
    fontWeight: 400,
    color: '#FFFFFF',
    fontFamily: 'Arial'
  };

  const updateTargetField = (field: keyof TextPropertyConfig, value: any, commit = true) => {
    onChange({
      ...config,
      [activeSection]: {
        ...targetConfig,
        [field]: value
      }
    }, commit);
  };

  const handleSeparatorUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingSeparator(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `separator-${activeSection}-${Date.now()}.${fileExt}`;
      const filePath = `${slug}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('overlay-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('overlay-assets')
        .getPublicUrl(filePath);

      updateTargetField('scrollSeparatorLogoUrl', publicUrl);
    } catch (err: any) {
      console.error('Error uploading separator logo:', err);
      alert('Erro no upload: ' + (err.message || err.error_description || err));
    } finally {
      setUploadingSeparator(false);
    }
  };

  // Helper to parse color structure
  const getColorMode = (colorProp: string | TextColor): 'solid' | 'linear' | 'radial' => {
    if (typeof colorProp === 'string') return 'solid';
    return colorProp.type || 'solid';
  };

  const currentMode = getColorMode(targetConfig.color);

  const handleModeChange = (mode: 'solid' | 'linear' | 'radial') => {
    if (mode === 'solid') {
      let currentColor = '#FFFFFF';
      if (typeof targetConfig.color === 'string') currentColor = targetConfig.color;
      else if (targetConfig.color.type === 'solid') currentColor = targetConfig.color.color;
      else if (targetConfig.color.type === 'linear') currentColor = targetConfig.color.start;
      else if (targetConfig.color.type === 'radial') currentColor = targetConfig.color.center;

      updateTargetField('color', { type: 'solid', color: currentColor } as TextColorSolid);
    } else if (mode === 'linear') {
      let start = '#1678D3';
      let end = '#FFFFFF';
      if (typeof targetConfig.color === 'string') start = targetConfig.color;
      else if (targetConfig.color.type === 'solid') start = targetConfig.color.color;
      else if (targetConfig.color.type === 'linear') {
        start = targetConfig.color.start;
        end = targetConfig.color.end;
      }

      updateTargetField('color', {
        type: 'linear',
        start,
        end,
        direction: 'to right'
      } as TextColorLinear);
    } else if (mode === 'radial') {
      let center = '#FFFFFF';
      let edge = '#1678D3';
      if (typeof targetConfig.color === 'string') center = targetConfig.color;
      else if (targetConfig.color.type === 'solid') center = targetConfig.color.color;
      else if (targetConfig.color.type === 'radial') {
        center = targetConfig.color.center;
        edge = targetConfig.color.edge;
      }

      updateTargetField('color', {
        type: 'radial',
        center,
        edge
      } as TextColorRadial);
    }
  };

  const getSolidColor = () => {
    if (typeof targetConfig.color === 'string') return targetConfig.color;
    if (targetConfig.color.type === 'solid') return targetConfig.color.color;
    return '#FFFFFF';
  };

  const getLinearColor = (): TextColorLinear => {
    if (typeof targetConfig.color !== 'string' && targetConfig.color.type === 'linear') {
      return targetConfig.color;
    }
    return { type: 'linear', start: '#1678D3', end: '#FFFFFF', direction: 'to right' };
  };

  const getRadialColor = (): TextColorRadial => {
    if (typeof targetConfig.color !== 'string' && targetConfig.color.type === 'radial') {
      return targetConfig.color;
    }
    return { type: 'radial', center: '#FFFFFF', edge: '#1678D3' };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-5">
      {/* Selector between 4 Text Sections */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-800 pb-3 gap-2">
        <button
          onClick={() => setActiveSection('topText')}
          className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
            activeSection === 'topText'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Texto Superior
        </button>
        <button
          onClick={() => setActiveSection('title')}
          className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
            activeSection === 'title'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Título Principal
        </button>
        <button
          onClick={() => setActiveSection('subtitle')}
          className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
            activeSection === 'subtitle'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Subtítulo / Cargo
        </button>
        <button
          onClick={() => setActiveSection('bottomText')}
          className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
            activeSection === 'bottomText'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Texto Inferior
        </button>
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-slate-400 font-medium">Conteúdo do Texto</label>
        <input
          type="text"
          value={targetConfig.content}
          onChange={(e) => updateTargetField('content', e.target.value, false)}
          onBlur={(e) => updateTargetField('content', e.target.value, true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateTargetField('content', e.currentTarget.value, true);
            }
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Text Transform */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-slate-400 font-medium">Capitalização do Texto</label>
        <div className="flex gap-1.5">
          {([
            { value: 'none',       label: 'Aa',    title: 'Original (sem transformação)' },
            { value: 'uppercase',  label: 'AA',    title: 'TODAS EM MAIÚSCULAS' },
            { value: 'lowercase',  label: 'aa',    title: 'todas em minúsculas' },
            { value: 'capitalize', label: 'Aa Bb', title: 'Primeira De Cada Palavra' },
            { value: 'sentence',   label: 'Aa bb', title: 'Primeira da frase maiúscula' },
          ] as { value: string; label: string; title: string }[]).map((opt) => {
            const isActive = (targetConfig.textTransform ?? 'none') === opt.value;
            return (
              <button
                key={opt.value}
                title={opt.title}
                type="button"
                onClick={() => updateTargetField('textTransform', opt.value as any)}
                className={`flex-1 py-2 px-0.5 rounded-lg text-[11px] font-bold border transition-all ${
                  isActive
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <span className="text-[10px] text-slate-600 leading-tight">
          {({
            none: 'Sem transformação — exibe o texto como digitado',
            uppercase: 'TEXTO EM MAIÚSCULAS',
            lowercase: 'texto em minúsculas',
            capitalize: 'Primeira Letra De Cada Palavra',
            sentence: 'Primeira letra da frase maiúscula',
          } as Record<string, string>)[targetConfig.textTransform ?? 'none']}
        </span>
      </div>

      {/* Font Family & Weight */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium">Fonte</label>
          <select
            value={targetConfig.fontFamily || 'Arial'}
            onChange={(e) => updateTargetField('fontFamily', e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          >
            {POPULAR_FONTS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium">Peso (Weight)</label>
          <select
            value={targetConfig.fontWeight || 700}
            onChange={(e) => updateTargetField('fontWeight', Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          >
            {FONT_WEIGHTS.map((fw) => (
              <option key={fw.value} value={fw.value}>
                {fw.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Font Size & Position & Max Width */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium">Tamanho (px)</label>
          <input
            type="number"
            value={targetConfig.fontSize}
            onChange={(e) => updateTargetField('fontSize', Number(e.target.value), false)}
            onBlur={(e) => updateTargetField('fontSize', Number(e.target.value), true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateTargetField('fontSize', Number(e.currentTarget.value), true);
              }
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium">Posição X</label>
          <input
            type="number"
            value={targetConfig.x}
            onChange={(e) => updateTargetField('x', Number(e.target.value), false)}
            onBlur={(e) => updateTargetField('x', Number(e.target.value), true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateTargetField('x', Number(e.currentTarget.value), true);
              }
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium">Posição Y</label>
          <input
            type="number"
            value={targetConfig.y}
            onChange={(e) => updateTargetField('y', Number(e.target.value), false)}
            onBlur={(e) => updateTargetField('y', Number(e.target.value), true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateTargetField('y', Number(e.currentTarget.value), true);
              }
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium" title="Largura máxima para não estourar a área (0 = automático)">Largura Máx. (px)</label>
          <input
            type="number"
            placeholder="Auto"
            value={targetConfig.maxWidth || ''}
            onChange={(e) => updateTargetField('maxWidth', Number(e.target.value), false)}
            onBlur={(e) => updateTargetField('maxWidth', Number(e.target.value), true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateTargetField('maxWidth', Number(e.currentTarget.value), true);
              }
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Color Section */}
      <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Estilo de Cor e Preenchimento</label>
        
        {/* Mode Selector */}
        <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-lg gap-1">
          <button
            type="button"
            onClick={() => handleModeChange('solid')}
            className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
              currentMode === 'solid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sólida
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('linear')}
            className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
              currentMode === 'linear' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Gradiente Linear
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('radial')}
            className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
              currentMode === 'radial' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Gradiente Radial
          </button>
        </div>

        {/* Solid Color Config */}
        {currentMode === 'solid' && (
          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <input
              type="color"
              value={getSolidColor()}
              onChange={(e) => updateTargetField('color', { type: 'solid', color: e.target.value })}
              className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent"
            />
            <div className="flex flex-col">
              <span className="text-xs text-slate-300 font-mono uppercase">{getSolidColor()}</span>
              <span className="text-[10px] text-slate-500">Cor sólida do texto</span>
            </div>
          </div>
        )}

        {/* Linear Gradient Config */}
        {currentMode === 'linear' && (() => {
          const linear = getLinearColor();
          return (
            <div className="flex flex-col gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={linear.start}
                    onChange={(e) =>
                      updateTargetField('color', { ...linear, start: e.target.value })
                    }
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400">Cor Inicial</span>
                    <span className="text-xs font-mono uppercase text-slate-200">{linear.start}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={linear.end}
                    onChange={(e) =>
                      updateTargetField('color', { ...linear, end: e.target.value })
                    }
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400">Cor Final</span>
                    <span className="text-xs font-mono uppercase text-slate-200">{linear.end}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400">Direção</label>
                <select
                  value={linear.direction || 'to right'}
                  onChange={(e) =>
                    updateTargetField('color', { ...linear, direction: e.target.value as any })
                  }
                  className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="to right">Horizontal (Esquerda → Direita)</option>
                  <option value="to left">Horizontal (Direita → Esquerda)</option>
                  <option value="to bottom">Vertical (Cima → Baixo)</option>
                  <option value="to top">Vertical (Baixo → Cima)</option>
                  <option value="to bottom right">Diagonal (Cima Esquerda → Baixo Direita)</option>
                  <option value="to bottom left">Diagonal (Cima Direita → Baixo Esquerda)</option>
                </select>
              </div>
            </div>
          );
        })()}

        {/* Radial Gradient Config */}
        {currentMode === 'radial' && (() => {
          const radial = getRadialColor();
          return (
            <div className="flex flex-col gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={radial.center}
                    onChange={(e) =>
                      updateTargetField('color', { ...radial, center: e.target.value })
                    }
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400">Cor do Centro</span>
                    <span className="text-xs font-mono uppercase text-slate-200">{radial.center}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={radial.edge}
                    onChange={(e) =>
                      updateTargetField('color', { ...radial, edge: e.target.value })
                    }
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400">Cor das Bordas</span>
                    <span className="text-xs font-mono uppercase text-slate-200">{radial.edge}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Scrolling & Separator Logo Section */}
      <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Letreiro / Rolagem Automática</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!targetConfig.scrollEnabled}
              onChange={(e) => updateTargetField('scrollEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {targetConfig.scrollEnabled && (
          <div className="flex flex-col gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400">Velocidade (segundos por ciclo)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={targetConfig.scrollSpeed ?? 20}
                  onChange={(e) => updateTargetField('scrollSpeed', Number(e.target.value), false)}
                  onBlur={(e) => updateTargetField('scrollSpeed', Number(e.target.value), true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateTargetField('scrollSpeed', Number(e.currentTarget.value), true);
                    }
                  }}
                  className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                />
                <span className="text-[9px] text-slate-500">Valores menores = mais rápido</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400">Espaçamento / Margem (px)</label>
                <input
                  type="number"
                  value={targetConfig.scrollSeparatorMargin ?? 30}
                  onChange={(e) => updateTargetField('scrollSeparatorMargin', Number(e.target.value), false)}
                  onBlur={(e) => updateTargetField('scrollSeparatorMargin', Number(e.target.value), true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateTargetField('scrollSeparatorMargin', Number(e.currentTarget.value), true);
                    }
                  }}
                  className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-900">
              <label className="text-xs font-medium text-slate-300">Logo / Ícone Separador</label>
              <div className="flex items-center gap-3">
                {targetConfig.scrollSeparatorLogoUrl ? (
                  <div className="relative w-12 h-12 rounded border border-slate-800 bg-slate-900 flex items-center justify-center p-1 group">
                    <img
                      src={targetConfig.scrollSeparatorLogoUrl}
                      alt="Separator preview"
                      className="max-w-full max-h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => updateTargetField('scrollSeparatorLogoUrl', null)}
                      className="absolute inset-0 bg-rose-600/90 text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity duration-200"
                    >
                      REMOVER
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded border border-dashed border-slate-800 flex items-center justify-center text-[10px] text-slate-600">
                    Sem Logo
                  </div>
                )}

                <label className="flex-1">
                  <span className={`w-full flex items-center justify-center gap-2 py-2 px-3 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors ${uploadingSeparator ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingSeparator ? 'Carregando...' : 'Fazer Upload do Separador'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSeparatorUpload}
                    disabled={uploadingSeparator}
                  />
                </label>
              </div>
            </div>

            {targetConfig.scrollSeparatorLogoUrl && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-400">Largura do Separador (px)</label>
                  <input
                    type="number"
                    value={targetConfig.scrollSeparatorLogoWidth ?? 24}
                    onChange={(e) => updateTargetField('scrollSeparatorLogoWidth', Number(e.target.value), false)}
                    onBlur={(e) => updateTargetField('scrollSeparatorLogoWidth', Number(e.target.value), true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateTargetField('scrollSeparatorLogoWidth', Number(e.currentTarget.value), true);
                      }
                    }}
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-400">Altura do Separador (px)</label>
                  <input
                    type="number"
                    value={targetConfig.scrollSeparatorLogoHeight ?? 24}
                    onChange={(e) => updateTargetField('scrollSeparatorLogoHeight', Number(e.target.value), false)}
                    onBlur={(e) => updateTargetField('scrollSeparatorLogoHeight', Number(e.target.value), true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateTargetField('scrollSeparatorLogoHeight', Number(e.currentTarget.value), true);
                      }
                    }}
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

