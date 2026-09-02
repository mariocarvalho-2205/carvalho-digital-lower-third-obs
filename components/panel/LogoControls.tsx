import React, { useState } from 'react';
import { LogoConfig } from '../../types/overlay';
import { createClient } from '../../lib/supabase/client';

interface LogoControlsProps {
  config: LogoConfig;
  onChange: (logo: LogoConfig, commit?: boolean) => void;
  slug: string;
}

export function LogoControls({ config, onChange, slug }: LogoControlsProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handlePropChange = (key: string, value: any) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `${slug}/${fileName}`;

      // Upload to bucket 'overlay-assets'
      const { error: uploadError } = await supabase.storage
        .from('overlay-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('overlay-assets')
        .getPublicUrl(filePath);

      handlePropChange('url', publicUrl);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      alert('Erro no upload: ' + (err.message || err.error_description || err));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    handlePropChange('url', null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Configuração da Logomarca</h3>
      
      {/* Upload and preview details */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-400 font-medium">Logomarca (PNG, SVG, WEBP)</label>
        <div className="flex items-center gap-3">
          {config.url ? (
            <div className="relative w-16 h-16 rounded border border-slate-800 bg-slate-950 flex items-center justify-center p-1 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={config.url} alt="Logo preview" className="max-w-full max-h-full object-contain" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute inset-0 bg-rose-600/90 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity duration-200"
              >
                REMOVER
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded border border-dashed border-slate-800 flex items-center justify-center text-xs text-slate-600">
              Sem Logo
            </div>
          )}

          <label className="flex-1">
            <span className={`w-full flex items-center justify-center gap-2 py-2 px-3 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploading ? 'Carregando...' : 'Fazer Upload'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Sizing, position & background customization */}
      <div className="grid grid-cols-2 gap-3 border-t border-slate-800/60 pt-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-medium">Posição X (px)</label>
          <input
            type="number"
            value={config.x}
            onChange={(e) => handlePropChange('x', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-medium">Posição Y (px)</label>
          <input
            type="number"
            value={config.y}
            onChange={(e) => handlePropChange('y', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-medium">Largura (px)</label>
          <input
            type="number"
            value={config.width}
            onChange={(e) => handlePropChange('width', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-medium">Altura (px)</label>
          <input
            type="number"
            value={config.height}
            onChange={(e) => handlePropChange('height', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-800/60 pt-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-medium">Estilo do Fundo</label>
          <div className="grid grid-cols-3 gap-2">
            {(['transparent', 'circle', 'square'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handlePropChange('backgroundType', type)}
                className={`py-1 px-2 text-[10px] font-semibold rounded border capitalize ${
                  config.backgroundType === type ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {type === 'transparent' ? 'Transp.' : type}
              </button>
            ))}
          </div>
        </div>

        {config.backgroundType !== 'transparent' && (
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-medium">Cor de Fundo</label>
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
                className="w-full h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-medium">Espaçamento (Padding)</label>
              <input
                type="number"
                value={config.padding}
                onChange={(e) => handlePropChange('padding', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
