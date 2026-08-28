export interface CanvasConfig {
  width: number;
  height: number;
}

export type TextColorSolid = {
  type: 'solid';
  color: string;
};

export type TextColorLinear = {
  type: 'linear';
  start: string;
  end: string;
  direction: 'to right' | 'to left' | 'to bottom' | 'to top' | 'to bottom right' | 'to bottom left';
};

export type TextColorRadial = {
  type: 'radial';
  center: string;
  edge: string;
};

export type TextColor = TextColorSolid | TextColorLinear | TextColorRadial;

export interface TextPropertyConfig {
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  /** Can be a plain hex string (legacy) or a TextColor object */
  color: string | TextColor;
  maxWidth?: number; // Optional right boundary limit / max width in pixels
  // Scrolling options (especially for bottomText ticker)
  scrollEnabled?: boolean;
  scrollSpeed?: number; // seconds for full loop or px/sec
  scrollSeparatorLogoUrl?: string | null;
  scrollSeparatorLogoWidth?: number;
  scrollSeparatorLogoHeight?: number;
  scrollSeparatorMargin?: number;
}

export interface TextsConfig {
  title: TextPropertyConfig;
  subtitle: TextPropertyConfig;
  topText?: TextPropertyConfig;
  bottomText?: TextPropertyConfig;
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient';
  color?: string; // used if type is solid
  start?: string; // used if type is gradient
  end?: string;   // used if type is gradient
  direction?: 'right' | 'left' | 'top' | 'bottom';
}

export interface CornerRadiusConfig {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export interface BarConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  background: BackgroundConfig;
  radius: CornerRadiusConfig;
  enabled?: boolean;
  locked?: boolean;
}

export interface ContentBoxConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  background: string | BackgroundConfig;
  radius: CornerRadiusConfig;
  opacity: number;
  enabled?: boolean;
  locked?: boolean;
}

export interface LogoConfig {
  url: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundType: 'transparent' | 'circle' | 'square';
  backgroundColor: string;
  padding: number;
}

export interface AnimationConfig {
  enter: 'fade' | 'slide-left' | 'slide-right' | 'slide-up';
  exit: 'fade' | 'slide-left' | 'slide-right' | 'slide-up';
  duration: number; // in milliseconds
}

export interface GlobalTransformConfig {
  x: number;       // Offset X em pixels
  y: number;       // Offset Y em pixels
  scale: number;   // Escala global (ex: 1 = 100%, 0.8 = 80%)
}

export interface OverlayConfig {
  canvas: CanvasConfig;
  texts: TextsConfig;
  topBar: BarConfig;
  contentBox: ContentBoxConfig;
  bottomBar: BarConfig;
  logo: LogoConfig;
  animation: AnimationConfig;
  globalTransform?: GlobalTransformConfig;
}

export interface OverlayData {
  id?: string;
  slug: string;
  name: string;
  config: OverlayConfig;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
