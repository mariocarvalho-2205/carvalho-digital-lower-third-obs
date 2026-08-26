import React from 'react';
import { OverlayConfig } from '../../types/overlay';
import { Shape } from './Shape';
import { TextElement } from './TextElement';
import { LogoElement } from './LogoElement';
import { OverlayCanvas } from './OverlayCanvas';

interface LowerThirdProps {
  config: OverlayConfig;
  isActive: boolean;
}

export function LowerThird({ config, isActive }: LowerThirdProps) {
  const { topBar, contentBox, bottomBar, texts, logo, animation } = config;

  // Generate custom keyframes style based on animation.enter and animation.exit
  const renderAnimationStyles = () => {
    const duration = `${animation.duration}ms`;

    const getEnterTransform = () => {
      if (animation.enter === 'slide-left') return 'translateX(-100vw)';
      if (animation.enter === 'slide-right') return 'translateX(100vw)';
      if (animation.enter === 'slide-up') return 'translateY(100vh)';
      return 'translate(0, 0)';
    };

    const getExitTransform = () => {
      if (animation.exit === 'slide-left') return 'translateX(-100vw)';
      if (animation.exit === 'slide-right') return 'translateX(100vw)';
      if (animation.exit === 'slide-up') return 'translateY(100vh)';
      return 'translate(0, 0)';
    };

    return (
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes animEnter {
            0% {
              opacity: 0;
              transform: ${getEnterTransform()};
            }
            100% {
              opacity: 1;
              transform: translate(0, 0);
            }
          }
          @keyframes animExit {
            0% {
              opacity: 1;
              transform: translate(0, 0);
            }
            100% {
              opacity: 0;
              transform: ${getExitTransform()};
            }
          }
          .anim-active {
            animation: animEnter ${duration} cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .anim-inactive {
            animation: animExit ${duration} cubic-bezier(0.16, 1, 0.3, 1) forwards;
            pointer-events: none;
          }
        `
      }} />
    );
  };

  const contentBoxBorderRadius = `${contentBox.radius.topLeft}px ${contentBox.radius.topRight}px ${contentBox.radius.bottomRight}px ${contentBox.radius.bottomLeft}px`;

  const globalTransform = config.globalTransform || { x: 0, y: 0, scale: 1 };

  return (
    <OverlayCanvas width={config.canvas.width} height={config.canvas.height}>
      {renderAnimationStyles()}
      <div
        className="w-full h-full relative"
        style={{
          transform: `translate(${globalTransform.x}px, ${globalTransform.y}px) scale(${globalTransform.scale})`,
          transformOrigin: 'bottom left'
        }}
      >
        <div
          className={`w-full h-full relative ${isActive ? 'anim-active' : 'anim-inactive'}`}
          style={{
            background: 'transparent',
          }}
        >
        {/* Retângulo Superior */}
        <Shape config={topBar} />
        {texts.topText && <TextElement config={texts.topText} />}

        {/* Área Principal (ContentBox) */}
        <div
          style={{
            position: 'absolute',
            left: `${contentBox.x}px`,
            top: `${contentBox.y}px`,
            width: `${contentBox.width}px`,
            height: `${contentBox.height}px`,
            background: typeof contentBox.background === 'string'
              ? contentBox.background
              : contentBox.background.type === 'gradient'
                ? `linear-gradient(to ${contentBox.background.direction || 'right'}, ${contentBox.background.start}, ${contentBox.background.end})`
                : contentBox.background.color || '#FFFFFF',
            borderRadius: contentBoxBorderRadius,
            opacity: contentBox.opacity,
            pointerEvents: 'none',
            boxSizing: 'border-box',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        />

        {/* Textos Principais */}
        <TextElement config={texts.title} />
        <TextElement config={texts.subtitle} />

        {/* Logo */}
        <LogoElement config={logo} />

        {/* Retângulo Inferior */}
        <Shape config={bottomBar} />
        {texts.bottomText && <TextElement config={texts.bottomText} containerBar={bottomBar} />}
      </div>
    </div>
  </OverlayCanvas>
  );
}
