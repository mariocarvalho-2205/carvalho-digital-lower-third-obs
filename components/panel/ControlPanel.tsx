'use client';

import React, { useState } from 'react';
import { OverlayData, OverlayConfig, VariationData } from '../../types/overlay';
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
  onFlushUpdate: (updates: Partial<OverlayData>) => Promise<void>;
  onUpdateVariation: (id: string, updates: Partial<VariationData>) => Promise<void>;
  onFlushVariation: (id: string, updates: Partial<VariationData>) => Promise<void>;
  onCreateVariation: (variation: Omit<VariationData, 'id' | 'created_at' | 'updated_at' | 'order_index'>) => Promise<VariationData | undefined>;
  onDeleteVariation: (id: string) => Promise<void>;
  slug: string;
}

type TabType = 'global' | 'visual' | 'text' | 'logo' | 'animation';

export function ControlPanel({
  overlay,
  onUpdate,
  onFlushUpdate,
  onUpdateVariation,
  onFlushVariation,
  onCreateVariation,
  onDeleteVariation,
  slug
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(true);
  const [localConfig, setLocalConfig] = React.useState<OverlayConfig>(overlay.config);
  const [localVariations, setLocalVariations] = React.useState<VariationData[]>(overlay.variations ?? []);
  const [activeVariationId, setActiveVariationId] = useState<string | null>(null);

  React.useEffect(() => {
    setLocalConfig(overlay.config);
    setLocalVariations(overlay.variations ?? []);
  }, [overlay.config, overlay.variations]);

  // Find the variation currently being edited
  const currentVariation = localVariations.find((v) => v.id === activeVariationId);

  // When editing, LivePreview shows the active variation config, merged with global canvas/animation settings
  const previewConfig = React.useMemo(() => {
    if (currentVariation) {
      return {
        ...localConfig,
        topBar: currentVariation.config.topBar,
        contentBox: currentVariation.config.contentBox,
        bottomBar: currentVariation.config.bottomBar,
        texts: currentVariation.config.texts,
        logo: currentVariation.config.logo,
        globalTransform: currentVariation.config.globalTransform || localConfig.globalTransform,
      };
    }
    // Default to the first variation or root config if in list mode
    const firstVar = localVariations[0];
    if (firstVar) {
      return {
        ...localConfig,
        topBar: firstVar.config.topBar,
        contentBox: firstVar.config.contentBox,
        bottomBar: firstVar.config.bottomBar,
        texts: firstVar.config.texts,
        logo: firstVar.config.logo,
        globalTransform: firstVar.config.globalTransform || localConfig.globalTransform,
      };
    }
    return localConfig;
  }, [localConfig, currentVariation, localVariations]);

  // Update a property of the selected variation
  const handleVariationChange = (section: string, value: any, commit = true) => {
    if (!activeVariationId) return;

    const updatedVariations = localVariations.map((v) => {
      if (v.id === activeVariationId) {
        return {
          ...v,
          config: {
            ...v.config,
            [section]: value,
          }
        };
      }
      return v;
    });

    setLocalVariations(updatedVariations);
    if (commit) {
      const updatedVar = updatedVariations.find(v => v.id === activeVariationId);
      if (updatedVar) {
        onUpdateVariation(activeVariationId, {
          config: updatedVar.config
        });
      }
    }
  };

  // Toggle active state of a variation on the list
  const handleToggleVariationActive = (id: string, active: boolean) => {
    const updatedVariations = localVariations.map((v) => {
      if (v.id === id) {
        return { ...v, is_active: active };
      }
      return v;
    });

    setLocalVariations(updatedVariations);
    onFlushVariation(id, { is_active: active });
  };

  // Create a new variation
  const handleCreateVariation = async () => {
    const newName = prompt('Nome da nova variação:', `Variação ${localVariations.length + 1}`);
    if (!newName) return;

    const baseTemplate = currentVariation?.config || localVariations[0]?.config || {
      topBar: localConfig.topBar,
      contentBox: localConfig.contentBox,
      bottomBar: localConfig.bottomBar,
      texts: localConfig.texts,
      logo: localConfig.logo,
      globalTransform: localConfig.globalTransform,
    };

    const newVariation = {
      name: newName,
      is_active: false,
      config: JSON.parse(JSON.stringify(baseTemplate)),
      overlay_id: overlay.id!
    };

    const created = await onCreateVariation(newVariation);
    if (created) {
      setLocalVariations([...localVariations, created]);
      setActiveVariationId(created.id);
    }
  };

  // Duplicate variation
  const handleDuplicateVariation = async (id: string) => {
    const target = localVariations.find((v) => v.id === id);
    if (!target) return;

    const newVariation = {
      name: `${target.name} - Cópia`,
      is_active: false,
      config: JSON.parse(JSON.stringify(target.config)),
      overlay_id: overlay.id!
    };

    const created = await onCreateVariation(newVariation);
    if (created) {
      setLocalVariations([...localVariations, created]);
    }
  };

  // Delete variation
  const handleDeleteVariation = async (id: string) => {
    if (localVariations.length <= 1) {
      alert('Você precisa ter pelo menos uma variação ativa.');
      return;
    }
    if (!confirm('Tem certeza que deseja excluir esta variação?')) return;

    await onDeleteVariation(id);
    setLocalVariations(localVariations.filter((v) => v.id !== id));
    if (activeVariationId === id) {
      setActiveVariationId(null);
    }
  };

  // Update specific variation text or configuration
  const handleRenameVariation = (newName: string) => {
    if (!activeVariationId) return;

    const updatedVariations = localVariations.map((v) => {
      if (v.id === activeVariationId) {
        return { ...v, name: newName };
      }
      return v;
    });

    setLocalVariations(updatedVariations);
    onUpdateVariation(activeVariationId, { name: newName });
  };

  // Handle global tab (applies directly to root globalTransform)
  const handleGlobalConfigChange = (section: keyof OverlayConfig, value: any, commit = true) => {
    const updatedConfig = {
      ...localConfig,
      [section]: value,
    };
    setLocalConfig(updatedConfig);
    if (commit) {
      onUpdate({ config: updatedConfig });
    }
  };

  const tabs = [
    { id: 'text' as TabType, label: 'Textos', icon: Type },
    { id: 'visual' as TabType, label: 'Elementos Visuais', icon: Sliders },
    { id: 'logo' as TabType, label: 'Logomarca', icon: ImageIcon },
    { id: 'global' as TabType, label: 'Ajuste Geral', icon: Move },
    { id: 'animation' as TabType, label: 'Transições', icon: Sparkles },
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Lado Esquerdo: Preview e Ações Rápidas */}
      <div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-6">
        <LivePreview
          config={previewConfig}
          variations={localVariations}
          isActive={currentVariation ? currentVariation.is_active : overlay.is_active}
          isPreviewActive={isPreviewActive}
          activeVariationId={activeVariationId}
        />

        <VisibilityControls
          isActive={currentVariation ? currentVariation.is_active : overlay.is_active}
          onToggle={() => {
            if (currentVariation) {
              handleToggleVariationActive(currentVariation.id, !currentVariation.is_active);
            } else {
              onFlushUpdate({ is_active: !overlay.is_active });
            }
          }}
          isPreviewActive={isPreviewActive}
          onTogglePreview={() => setIsPreviewActive((prev) => !prev)}
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

      {/* Lado Direito: Lista de Variações ou Painel de Edição */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        {activeVariationId === null ? (
          /* MODO LISTA */
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Variações de Lower Third</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Gerencie os nomes e layouts a serem exibidos no OBS</p>
              </div>
              <button
                onClick={handleCreateVariation}
                className="flex items-center gap-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold border border-blue-500 transition-all shadow-md shadow-blue-900/10"
              >
                + CRIAR VARIAÇÃO
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {localVariations.map((v) => (
                <div
                  key={v.id}
                  className="bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-lg p-3.5 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${v.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
                      <span className="font-semibold text-slate-200 text-sm truncate">{v.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                      Texto: &quot;{v.config?.texts?.title?.content || '—'}&quot; | &quot;{v.config?.texts?.subtitle?.content || '—'}&quot;
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Ativar/Desativar individualmente */}
                    <button
                      onClick={() => handleToggleVariationActive(v.id, !v.is_active)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                        v.is_active
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                      }`}
                    >
                      {v.is_active ? 'ATIVO (ON)' : 'OFF'}
                    </button>

                    {/* Editar */}
                    <button
                      onClick={() => setActiveVariationId(v.id)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-bold border border-slate-800 transition-all"
                    >
                      EDITAR
                    </button>

                    {/* Duplicar */}
                    <button
                      onClick={() => handleDuplicateVariation(v.id)}
                      title="Criar Cópia"
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-bold border border-slate-800 transition-all"
                    >
                      DUPLICAR
                    </button>

                    {/* Excluir */}
                    <button
                      onClick={() => handleDeleteVariation(v.id)}
                      className="px-2 py-1 bg-slate-900 hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 rounded text-[10px] font-bold border border-slate-850 hover:border-rose-900/30 transition-all"
                    >
                      EXCLUIR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* MODO EDIÇÃO DE VARIAÇÃO ESPECÍFICA */
          <div className="flex flex-col gap-4">
            {/* Header de Edição */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveVariationId(null)}
                  className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white rounded border border-slate-800 text-xs font-bold transition-all"
                >
                  ← VOLTAR
                </button>
                <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Editando Variação</span>
                  <span className="text-sm font-bold text-white max-w-[200px] truncate">{currentVariation?.name}</span>
                </div>
              </div>

              {/* Renomear campo rápido */}
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1">
                <span className="text-[10px] text-slate-500">Nome:</span>
                <input
                  type="text"
                  value={currentVariation?.name || ''}
                  onChange={(e) => handleRenameVariation(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none w-28 sm:w-36 font-semibold"
                />
              </div>
            </div>

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
                  config={currentVariation?.config?.globalTransform || localConfig.globalTransform}
                  onChange={(val, commit) => handleVariationChange('globalTransform', val, commit)}
                />
              )}

              {activeTab === 'text' && (
                <TextControls
                  config={currentVariation?.config?.texts || localConfig.texts}
                  onChange={(val, commit) => handleVariationChange('texts', val, commit)}
                  slug={slug}
                />
              )}

              {activeTab === 'visual' && (
                <>
                  <ShapeControls
                    label="Barra Superior"
                    config={currentVariation?.config?.topBar || localConfig.topBar}
                    onChange={(val, commit) => handleVariationChange('topBar', val, commit)}
                  />
                  <ShapeControls
                    label="Área Principal (Corpo Branco)"
                    config={currentVariation?.config?.contentBox || localConfig.contentBox}
                    onChange={(val, commit) => handleVariationChange('contentBox', val, commit)}
                  />
                  <ShapeControls
                    label="Barra Inferior"
                    config={currentVariation?.config?.bottomBar || localConfig.bottomBar}
                    onChange={(val, commit) => handleVariationChange('bottomBar', val, commit)}
                  />
                </>
              )}

              {activeTab === 'logo' && (
                <LogoControls
                  config={currentVariation?.config?.logo || localConfig.logo}
                  onChange={(val, commit) => handleVariationChange('logo', val, commit)}
                  slug={slug}
                />
              )}

              {activeTab === 'animation' && (
                <AnimationControls
                  config={localConfig.animation}
                  onChange={(val, commit) => handleGlobalConfigChange('animation', val, commit)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
