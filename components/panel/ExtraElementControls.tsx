'use client';

import React, { useState } from 'react';
import { ExtraElementConfig, TextPropertyConfig } from '../../types/overlay';
import { ShapeControls } from './ShapeControls';
import { ChevronDown, ChevronRight, Type, Trash2, GripVertical, Check, X } from 'lucide-react';

interface ExtraElementControlsProps {
  element: ExtraElementConfig;
  onChange: (updated: ExtraElementConfig, commit?: boolean) => void;
  onDelete: () => void;
}

const DEFAULT_TEXT: TextPropertyConfig = {
  content: 'Texto',
  x: 0,
  y: 0,
  fontSize: 16,
  fontWeight: 400,
  fontFamily: 'Arial',
  color: '#FFFFFF',
};

export function ExtraElementControls({ element, onChange, onDelete }: ExtraElementControlsProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);

  const handleShapeChange = (shapeVal: any, commit?: boolean) => {
    onChange({ ...element, shape: shapeVal }, commit);
  };

  const handleToggleText = (enabled: boolean) => {
    const updated: ExtraElementConfig = {
      ...element,
      textEnabled: enabled,
      text: enabled
        ? (element.text || { ...DEFAULT_TEXT, x: element.shape.x + 10, y: element.shape.y + 10 })
        : element.text, // Keep config even when disabled so toggling back restores it
    };
    onChange(updated, true);
  };

  const handleTextProp = (key: keyof TextPropertyConfig, value: any, commit = true) => {
    if (!element.text) return;
    const updatedText: TextPropertyConfig = { ...element.text, [key]: value };
    onChange({ ...element, text: updatedText }, commit);
  };

  const handleRename = (newName: string) => {
    onChange({ ...element, name: newName }, true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header — collapsible */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-slate-850/50 transition-colors select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <GripVertical className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        )}

        {isRenaming ? (
          <input
            type="text"
            value={element.name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleRename(e.target.value)}
            onBlur={() => setIsRenaming(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsRenaming(false);
            }}
            autoFocus
            className="bg-slate-950 border border-blue-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none flex-1 min-w-0"
          />
        ) : (
          <span
            className="text-xs font-semibold text-slate-300 truncate flex-1 min-w-0"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
            }}
            title="Duplo clique para renomear"
          >
            {element.name}
          </span>
        )}

        <div className="flex items-center gap-2 flex-shrink-0 ml-auto" onClick={(e) => e.stopPropagation()}>
          {/* Text toggle badge */}
          <button
            onClick={() => handleToggleText(!element.textEnabled)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
              element.textEnabled
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-800'
            }`}
            title={element.textEnabled ? 'Texto ativado' : 'Texto desativado'}
          >
            <Type className="w-3 h-3" />
            {element.textEnabled ? 'TEXTO ON' : 'TEXTO OFF'}
          </button>

          {/* Delete — two-step inline confirmation */}
          {confirmingDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-rose-400 font-bold">Excluir?</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setConfirmingDelete(false);
                  onDelete();
                }}
                className="p-1 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                title="Confirmar exclusão"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setConfirmingDelete(false);
                }}
                className="p-1 rounded border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors"
                title="Cancelar"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setConfirmingDelete(true);
                setTimeout(() => setConfirmingDelete(false), 5000);
              }}
              className="p-1.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
              title="Excluir este elemento"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 flex flex-col gap-4 border-t border-slate-800/60">
          {/* Shape Controls */}
          <div className="mt-3">
            <ShapeControls
              label={`Shape — ${element.name}`}
              config={element.shape}
              onChange={handleShapeChange}
            />
          </div>

          {/* Text Controls (when enabled) */}
          {element.textEnabled && element.text && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-800/60 pb-2">
                <Type className="w-3.5 h-3.5 text-blue-400" />
                <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Texto do Elemento</h4>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-medium">Conteúdo</label>
                <input
                  type="text"
                  value={element.text.content}
                  onChange={(e) => handleTextProp('content', e.target.value, false)}
                  onBlur={(e) => handleTextProp('content', e.target.value, true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTextProp('content', e.currentTarget.value, true);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Position */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-medium">Posição X (px)</label>
                  <input
                    type="number"
                    value={element.text.x}
                    onChange={(e) => handleTextProp('x', parseInt(e.target.value) || 0, false)}
                    onBlur={(e) => handleTextProp('x', parseInt(e.target.value) || 0, true)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-medium">Posição Y (px)</label>
                  <input
                    type="number"
                    value={element.text.y}
                    onChange={(e) => handleTextProp('y', parseInt(e.target.value) || 0, false)}
                    onBlur={(e) => handleTextProp('y', parseInt(e.target.value) || 0, true)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Font Size + Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-medium">Tamanho (px)</label>
                  <input
                    type="number"
                    value={element.text.fontSize}
                    onChange={(e) => handleTextProp('fontSize', parseInt(e.target.value) || 12, false)}
                    onBlur={(e) => handleTextProp('fontSize', parseInt(e.target.value) || 12, true)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-medium">Peso</label>
                  <select
                    value={element.text.fontWeight}
                    onChange={(e) => handleTextProp('fontWeight', parseInt(e.target.value), true)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none"
                  >
                    <option value={100}>100 — Thin</option>
                    <option value={200}>200 — Extra Light</option>
                    <option value={300}>300 — Light</option>
                    <option value={400}>400 — Regular</option>
                    <option value={500}>500 — Medium</option>
                    <option value={600}>600 — Semi Bold</option>
                    <option value={700}>700 — Bold</option>
                    <option value={800}>800 — Extra Bold</option>
                    <option value={900}>900 — Black</option>
                  </select>
                </div>
              </div>

              {/* Font Family */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-medium">Família da Fonte</label>
                <input
                  type="text"
                  value={element.text.fontFamily}
                  onChange={(e) => handleTextProp('fontFamily', e.target.value, false)}
                  onBlur={(e) => handleTextProp('fontFamily', e.target.value, true)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Color */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-medium">Cor do Texto</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={typeof element.text.color === 'string' ? element.text.color : '#FFFFFF'}
                    onChange={(e) => handleTextProp('color', e.target.value, true)}
                    className="w-8 h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={typeof element.text.color === 'string' ? element.text.color : ''}
                    onChange={(e) => handleTextProp('color', e.target.value, true)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Max Width */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-medium">Largura Máxima (px, 0 = sem limite)</label>
                <input
                  type="number"
                  value={element.text.maxWidth || 0}
                  onChange={(e) => handleTextProp('maxWidth', parseInt(e.target.value) || 0, false)}
                  onBlur={(e) => handleTextProp('maxWidth', parseInt(e.target.value) || 0, true)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Text Transform */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-medium">Transformar Texto</label>
                <select
                  value={element.text.textTransform || 'none'}
                  onChange={(e) => handleTextProp('textTransform', e.target.value, true)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none"
                >
                  <option value="none">Nenhuma</option>
                  <option value="uppercase">MAIÚSCULAS</option>
                  <option value="lowercase">minúsculas</option>
                  <option value="capitalize">Capitalizar</option>
                  <option value="sentence">Primeira letra</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
