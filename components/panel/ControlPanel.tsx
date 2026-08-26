'use client';

import React, { useState } from 'react';
import { OverlayData, OverlayConfig } from '../../types/overlay';
import { LivePreview } from './LivePreview';
import { VisibilityControls } from './VisibilityControls';
import { TextControls } from './TextControls';
import { ShapeControls } from './ShapeControls';
import { LogoControls } from './LogoControls';
import { AnimationControls } from './AnimationControls';
import { GlobalTransformControls } from './GlobalTransformControls';
import { Sliders, Monitor, Eye, Image as ImageIcon, Type, Sparkles, Move } from 'lucide-react';

interface ControlPanelProps {
  overlay: OverlayData;
  onUpdate: (updates: Partial<OverlayData>) => Promise<void>;
  slug: string;
}

type TabType = 'global' | 'visual' | 'text' | 'logo' | 'animation';

export function ControlPanel({ overlay, onUpdate, slug }: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('text');

  const handleConfigChange = (section: keyof OverlayConfig, value: any) => {
    const updatedConfig = {
      ...overlay.config,
      [section]: value
    };
    onUpdate({ config: updatedConfig });
  };

  const tabs = [
    { id: 'global' as TabType, label: 'Ajuste Geral', icon: Move },
    { id: 'text' as TabType, label: 'Textos', icon: Type },
    { id: 'visual' as TabType, label: 'Elementos Visuais', icon: Sliders },
    { id: 'logo' as TabType, label: 'Logomarca', icon: ImageIcon },
    { id: 'animation' as TabType, label: 'Transições', icon: Sparkles },
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Lado Esquerdo: Preview e Ações Rápidas */}
      <div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-6">
        <LivePreview config={overlay.config} isActive={overlay.is_active} />

        <VisibilityControls
          isActive={overlay.is_active}
          onToggle={(val) => onUpdate({ is_active: val })}
        />

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2 text-xs text-slate-400">
          <div className="flex justify-between items-center py-1">
            <span className="font-semibold text-slate-300">OBS Browser Source URL:</span>
          </div>
          <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? `${window.location.origin}/overlay/${slug}` : `/overlay/${slug}`}
              className="bg-transparent flex-1 focus:outline-none select-all text-blue-400 font-mono text-[10px]"
            />
            <button
              onClick={() => {
                const url = typeof window !== 'undefined' ? `${window.location.origin}/overlay/${slug}` : '';
                navigator.clipboard.writeText(url);
                alert('URL copiada!');
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition-colors font-bold text-[9px]"
            >
              COPIAR
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Adicione esta URL no OBS como uma &ldquo;Fonte de Navegador&rdquo; (Largura: 1920, Altura: 1080).
          </p>
        </div>
      </div>

      {/* Lado Direito: Abas de Configuração detalhadas */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 pb-px overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab contents */}
        <div className="flex flex-col gap-4">
          {activeTab === 'global' && (
            <GlobalTransformControls
              config={overlay.config.globalTransform}
              onChange={(val) => handleConfigChange('globalTransform', val)}
            />
          )}

          {activeTab === 'text' && (
            <TextControls
              config={overlay.config.texts}
              onChange={(val) => handleConfigChange('texts', val)}
              slug={slug}
            />
          )}

          {activeTab === 'visual' && (
            <>
              <ShapeControls
                label="Barra Superior"
                config={overlay.config.topBar}
                onChange={(val) => handleConfigChange('topBar', val)}
              />
              <ShapeControls
                label="Área Principal (Corpo Branco)"
                config={overlay.config.contentBox}
                onChange={(val) => handleConfigChange('contentBox', val)}
              />
              <ShapeControls
                label="Barra Inferior"
                config={overlay.config.bottomBar}
                onChange={(val) => handleConfigChange('bottomBar', val)}
              />
            </>
          )}

          {activeTab === 'logo' && (
            <LogoControls
              config={overlay.config.logo}
              onChange={(val) => handleConfigChange('logo', val)}
              slug={slug}
            />
          )}

          {activeTab === 'animation' && (
            <AnimationControls
              config={overlay.config.animation}
              onChange={(val) => handleConfigChange('animation', val)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
