import React, { CSSProperties } from 'react';
import { TextPropertyConfig, TextColor, BarConfig } from '../../types/overlay';

interface TextElementProps {
  config: TextPropertyConfig;
  containerBar?: BarConfig;
}

export function TextElement({ config, containerBar }: TextElementProps) {
  const {
    content,
    x,
    y,
    fontSize,
    fontWeight,
    color,
    fontFamily,
    scrollEnabled,
    scrollSpeed = 20,
    scrollSeparatorLogoUrl,
    scrollSeparatorLogoWidth = 24,
    scrollSeparatorLogoHeight = 24,
    scrollSeparatorMargin = 30
  } = config;

  const getTextStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight,
      fontFamily: fontFamily || 'Arial',
      lineHeight: 1.2,
      userSelect: 'none',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center'
    };

    if (typeof color === 'string') {
      return { ...baseStyle, color: color };
    }

    const textColorObj = color as TextColor;

    if (textColorObj.type === 'solid') {
      return { ...baseStyle, color: textColorObj.color };
    }

    if (textColorObj.type === 'linear') {
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(${textColorObj.direction || 'to right'}, ${textColorObj.start}, ${textColorObj.end})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent'
      };
    }

    if (textColorObj.type === 'radial') {
      return {
        ...baseStyle,
        backgroundImage: `radial-gradient(circle, ${textColorObj.center}, ${textColorObj.edge})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent'
      };
    }

    return baseStyle;
  };

  // If scrolling is enabled, render seamless infinite marquee ticker
  if (scrollEnabled) {
    const containerX = x;
    const containerY = y;

    // Determine right limit: either explicit config.maxWidth or containerBar edge
    let containerWidth = 1000;
    if (config.maxWidth && config.maxWidth > 0) {
      containerWidth = config.maxWidth;
    } else if (containerBar) {
      const barRightBoundary = containerBar.x + containerBar.width;
      containerWidth = Math.max(100, barRightBoundary - x);
    }

    const renderTextItem = (keyPrefix: string) => (
      <div
        key={keyPrefix}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
          gap: `${scrollSeparatorMargin}px`,
          paddingRight: `${scrollSeparatorMargin}px`
        }}
      >
        <span style={getTextStyle()}>{content}</span>
        {scrollSeparatorLogoUrl ? (
          <img
            src={scrollSeparatorLogoUrl}
            alt="separator"
            style={{
              width: `${scrollSeparatorLogoWidth}px`,
              height: `${scrollSeparatorLogoHeight}px`,
              objectFit: 'contain',
              display: 'inline-block'
            }}
          />
        ) : (
          <span style={{ color: typeof color === 'string' ? color : '#FFFFFF', opacity: 0.5 }}>•</span>
        )}
      </div>
    );

    return (
      <div
        style={{
          position: 'absolute',
          left: `${containerX}px`,
          top: `${containerY}px`,
          width: `${containerWidth}px`,
          overflow: 'hidden',
          pointerEvents: 'none',
          boxSizing: 'border-box'
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes tickerScrollContinuous {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .ticker-track-wrapper {
              display: flex;
              width: max-content;
              will-change: transform;
              animation: tickerScrollContinuous ${scrollSpeed}s linear infinite;
            }
            .ticker-track-half {
              display: flex;
              align-items: center;
              flex-shrink: 0;
            }
          `
        }} />
        <div className="ticker-track-wrapper">
          <div className="ticker-track-half">
            {[1, 2, 3, 4, 5, 6].map(idx => renderTextItem(`h1-${idx}`))}
          </div>
          <div className="ticker-track-half">
            {[1, 2, 3, 4, 5, 6].map(idx => renderTextItem(`h2-${idx}`))}
          </div>
        </div>
      </div>
    );
  }

  // Standard static text position with optional maxWidth clipping/ellipsis
  const staticWidthStyle: CSSProperties = (config.maxWidth && config.maxWidth > 0)
    ? {
        maxWidth: `${config.maxWidth}px`,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    : {};

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        boxSizing: 'border-box',
        ...staticWidthStyle
      }}
    >
      <div style={getTextStyle()}>{content}</div>
    </div>
  );
}


