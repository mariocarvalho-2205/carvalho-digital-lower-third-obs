'use client';

import React, { useRef, useEffect, useState } from 'react';

interface OverlayCanvasProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export function OverlayCanvas({ children, width = 1920, height = 1080 }: OverlayCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const scaleX = containerWidth / width;
      const scaleY = containerHeight / height;
      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: `${width}px`,
          height: `${height}px`,
          top: 0,
          left: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          background: 'transparent',
        }}
        className="logical-canvas"
      >
        {children}
      </div>
    </div>
  );
}
