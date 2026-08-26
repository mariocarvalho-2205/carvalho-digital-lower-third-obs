import React from 'react';
import { LogoConfig } from '../../types/overlay';

interface LogoElementProps {
  config: LogoConfig;
}

export function LogoElement({ config }: LogoElementProps) {
  const { url, x, y, width, height, backgroundType, backgroundColor, padding } = config;

  if (!url) {
    // Render placeholder or empty if no URL
    return (
      <div
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: backgroundType === 'circle' ? '50%' : backgroundType === 'square' ? '8px' : '0',
          background: backgroundType !== 'transparent' ? backgroundColor : 'transparent',
          padding: `${padding}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed rgba(22, 120, 211, 0.4)',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ fontSize: '12px', color: '#1678D3', fontWeight: 'bold' }}>LOGO</span>
      </div>
    );
  }

  const getBorderRadius = () => {
    if (backgroundType === 'circle') return '50%';
    if (backgroundType === 'square') return '8px';
    return '0';
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: getBorderRadius(),
        background: backgroundType !== 'transparent' ? backgroundColor : 'transparent',
        padding: `${padding}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Logo"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
