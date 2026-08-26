import React from 'react';
import { BarConfig } from '../../types/overlay';

interface ShapeProps {
  config: BarConfig;
}

export function Shape({ config }: ShapeProps) {
  const { x, y, width, height, background, radius } = config;

  const getBackgroundStyle = () => {
    if (background.type === 'solid') {
      return background.color || '#transparent';
    }
    const dirMap = {
      right: 'to right',
      left: 'to left',
      top: 'to top',
      bottom: 'to bottom'
    };
    const direction = dirMap[background.direction || 'right'];
    return `linear-gradient(${direction}, ${background.start || '#transparent'}, ${background.end || '#transparent'})`;
  };

  const borderRadius = `${radius.topLeft}px ${radius.topRight}px ${radius.bottomRight}px ${radius.bottomLeft}px`;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        background: getBackgroundStyle(),
        borderRadius: borderRadius,
        pointerEvents: 'none',
        boxSizing: 'border-box'
      }}
    />
  );
}
