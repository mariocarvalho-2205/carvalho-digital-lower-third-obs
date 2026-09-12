import React from 'react';
import { OverlayConfig } from '../../types/overlay';
import { Shape } from './Shape';
import { TextElement } from './TextElement';
import { LogoElement } from './LogoElement';
import { OverlayCanvas } from './OverlayCanvas';

interface LowerThirdProps {
  config: OverlayConfig;
  isActive: boolean;
  isPreview?: boolean;
  testOverrides?: Record<string, boolean>;
}

export function LowerThird({ config, isActive, isPreview = false, testOverrides = {} }: LowerThirdProps) {
  const { topBar, contentBox, bottomBar, texts, logo, animation } = config;

  // Obey the enabled state even in preview mode so the user can see what's hidden
  const isTopBarEnabled = topBar.enabled !== false;
  const isContentBoxEnabled = contentBox.enabled !== false;
  const isBottomBarEnabled = bottomBar.enabled !== false;
  const isLogoEnabled = logo.enabled !== false;

  const getIsActive = (elementId: string) => {
    return testOverrides[elementId] !== undefined ? testOverrides[elementId] : isActive;
  };

  // Generate a stable unique suffix for this instance's keyframes
  // so multiple simultaneous variations don't clobber each other's animation styles.
  const animId = React.useId().replace(/:/g, '');

  // Generate custom keyframes style based on animation.enter and animation.exit
  const renderAnimationStyles = () => {
    const isGlobalEnabled = animation.enabled !== false;
    const globalDuration = `${animation.duration}ms`;

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

    let styles = '';

    // Global Animation
    if (isGlobalEnabled) {
      styles += `
        @keyframes animEnter_${animId} {
          0% { opacity: 0; transform: ${getEnterTransform()}; }
          100% { opacity: 1; transform: translate(0, 0); }
        }
        @keyframes animExit_${animId} {
          0% { opacity: 1; transform: translate(0, 0); }
          100% { opacity: 0; transform: ${getExitTransform()}; }
        }
        .anim-active-${animId} {
          animation: animEnter_${animId} ${globalDuration} cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-inactive-${animId} {
          animation: animExit_${animId} ${globalDuration} cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: none;
        }
      `;
    } else {
      styles += `
        .anim-active-${animId} { opacity: 1; }
        .anim-inactive-${animId} { opacity: 0; pointer-events: none; }
      `;
    }

    // Default bar animations removed per user request: When individual animation is disabled, 
    // the element now stays statically visible instead of falling back to default slide animations.

    // Helper to generate individual animations
    const generateIndAnim = (name: string, animConf: any, x: number, y: number, w: number, h: number) => {
      if (!animConf || !animConf.enabled) return '';
      
      const duration = animConf.duration || 500;
      const delay = animConf.delay || 0;
      
      const top = y;
      const left = x;
      const right = config.canvas.width - (x + w);
      const bottom = config.canvas.height - (y + h);
      
      const fullInset = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
      const hiddenRight = `inset(${top}px ${config.canvas.width - x}px ${bottom}px ${left}px)`; // collapsed to left
      const hiddenLeft = `inset(${top}px ${right}px ${bottom}px ${x + w}px)`; // collapsed to right
      const hiddenDown = `inset(${top}px ${right}px ${config.canvas.height - y}px ${left}px)`; // collapsed to top
      const hiddenUp = `inset(${y + h}px ${right}px ${bottom}px ${left}px)`; // collapsed to bottom

      const getIndState = (type: string, isStart: boolean) => {
        if (type === 'none') return `clip-path: ${fullInset}; opacity: 1; transform: none;`;
        if (type === 'fade') return `clip-path: ${fullInset}; opacity: ${isStart ? 0 : 1}; transform: none;`;
        if (type === 'spin-cw') return `clip-path: ${fullInset}; opacity: ${isStart ? 0 : 1}; transform: rotate(${isStart ? '-180deg' : '0deg'}) scale(${isStart ? 0.5 : 1}); transform-origin: ${x + w/2}px ${y + h/2}px;`;
        if (type === 'spin-ccw') return `clip-path: ${fullInset}; opacity: ${isStart ? 0 : 1}; transform: rotate(${isStart ? '180deg' : '0deg'}) scale(${isStart ? 0.5 : 1}); transform-origin: ${x + w/2}px ${y + h/2}px;`;
        
        let cp = fullInset;
        if (isStart) {
          if (type === 'wipe-right') cp = hiddenRight;
          if (type === 'wipe-left') cp = hiddenLeft;
          if (type === 'wipe-down') cp = hiddenDown;
          if (type === 'wipe-up') cp = hiddenUp;
        }
        return `clip-path: ${cp}; opacity: 1; transform: none;`;
      };

      const enterStart = getIndState(animConf.enter, true);
      const enterEnd = getIndState(animConf.enter, false);
      const exitStart = getIndState(animConf.exit, false);
      const exitEnd = getIndState(animConf.exit, true);

      return `
        @keyframes indEnter_${name}_${animId} {
          0% { ${enterStart} }
          100% { ${enterEnd} }
        }
        @keyframes indExit_${name}_${animId} {
          0% { ${exitStart} }
          100% { ${exitEnd} }
        }
        .${name}-ind-active {
          animation: indEnter_${name}_${animId} ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both;
        }
        .${name}-ind-inactive {
          animation: indExit_${name}_${animId} ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: none;
        }
      `;
    };

    styles += generateIndAnim('topBar', topBar.animation, topBar.x, topBar.y, topBar.width, topBar.height);
    styles += generateIndAnim('contentBox', contentBox.animation, contentBox.x, contentBox.y, contentBox.width, contentBox.height);
    styles += generateIndAnim('bottomBar', bottomBar.animation, bottomBar.x, bottomBar.y, bottomBar.width, bottomBar.height);
    styles += generateIndAnim('logo', logo.animation, logo.x, logo.y, logo.width, logo.height);
    
    (config.extraElements || []).forEach((el) => {
      styles += generateIndAnim(`extra_${el.id}`, el.shape.animation, el.shape.x, el.shape.y, el.shape.width, el.shape.height);
    });

    return <style dangerouslySetInnerHTML={{ __html: styles }} />;
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
          className={`w-full h-full relative ${isActive ? `anim-active-${animId}` : `anim-inactive-${animId}`}`}
          style={{
            background: 'transparent',
          }}
        >
          {/* Retângulo Superior */}
          <div className={`w-full h-full absolute inset-0 pointer-events-none ${!isTopBarEnabled ? 'opacity-0 hidden !pointer-events-none' : (topBar.animation?.enabled ? (getIsActive('topBar') ? 'topBar-ind-active' : 'topBar-ind-inactive') : '')}`}>
            <Shape config={topBar} />
            {texts.topText && <TextElement config={texts.topText} />}
          </div>

          {/* Área Principal (ContentBox) + Logo */}
          <div className={`w-full h-full absolute inset-0 pointer-events-none ${!isContentBoxEnabled ? 'opacity-0 hidden !pointer-events-none' : (contentBox.animation?.enabled ? (getIsActive('contentBox') ? 'contentBox-ind-active' : 'contentBox-ind-inactive') : '')}`}>
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
            <div className={`w-full h-full absolute inset-0 pointer-events-none ${!isLogoEnabled ? 'opacity-0 hidden !pointer-events-none' : (logo.animation?.enabled ? (getIsActive('logo') ? 'logo-ind-active' : 'logo-ind-inactive') : '')}`}>
              <LogoElement config={logo} />
            </div>
          </div>

          {/* Retângulo Inferior */}
          <div className={`w-full h-full absolute inset-0 pointer-events-none ${!isBottomBarEnabled ? 'opacity-0 hidden !pointer-events-none' : (bottomBar.animation?.enabled ? (getIsActive('bottomBar') ? 'bottomBar-ind-active' : 'bottomBar-ind-inactive') : '')}`}>
            <Shape config={bottomBar} />
            {texts.bottomText && <TextElement config={texts.bottomText} containerBar={bottomBar} />}
          </div>

          {/* Elementos Extras Dinâmicos */}
          {(config.extraElements || [])
            .filter(el => el.shape.enabled !== false)
            .sort((a, b) => a.order - b.order)
            .map((el) => (
              <div key={el.id} className={`w-full h-full absolute inset-0 pointer-events-none ${el.shape.enabled === false ? 'opacity-0 hidden !pointer-events-none' : (el.shape.animation?.enabled ? (getIsActive(`extra_${el.id}`) ? `extra_${el.id}-ind-active` : `extra_${el.id}-ind-inactive`) : '')}`}>
                <Shape config={el.shape} />
                {el.textEnabled && el.text && <TextElement config={el.text} />}
              </div>
            ))}
        </div>
      </div>
    </OverlayCanvas>
  );
}
