import { OverlayConfig } from '../types/overlay';

export const DEFAULT_OVERLAY_CONFIG: OverlayConfig = {
  canvas: {
    width: 1920,
    height: 1080
  },
  texts: {
    title: {
      content: "MÁRIO CARVALHO",
      x: 280,
      y: 710,
      fontSize: 42,
      fontWeight: 700,
      color: "#173A7A",
      fontFamily: "Arial"
    },
    subtitle: {
      content: "APRESENTADOR",
      x: 280,
      y: 765,
      fontSize: 24,
      fontWeight: 400,
      color: "#333333",
      fontFamily: "Arial"
    },
    topText: {
      content: "AO VIVO",
      x: 245,
      y: 642,
      fontSize: 22,
      fontWeight: 700,
      color: "#FFFFFF",
      fontFamily: "Arial"
    },
    bottomText: {
      content: "CARVALHO DIGITAL STREAM",
      x: 245,
      y: 838,
      fontSize: 18,
      fontWeight: 600,
      color: "#FFFFFF",
      fontFamily: "Arial"
    }
  },
  topBar: {
    x: 220,
    y: 630,
    width: 440,
    height: 58,
    background: {
      type: "solid",
      color: "#1678D3"
    },
    radius: {
      topLeft: 25,
      topRight: 25,
      bottomRight: 0,
      bottomLeft: 0
    },
    enabled: true
  },
  contentBox: {
    x: 220,
    y: 688,
    width: 1100,
    height: 138,
    background: "#FFFFFF",
    radius: {
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0
    },
    opacity: 1,
    enabled: true
  },
  bottomBar: {
    x: 220,
    y: 826,
    width: 1200,
    height: 48,
    background: {
      type: "gradient",
      start: "#1678D3",
      end: "#6200D8",
      direction: "right"
    },
    radius: {
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0
    },
    enabled: true
  },
  logo: {
    url: null,
    x: 1220,
    y: 670,
    width: 150,
    height: 150,
    backgroundType: "circle",
    backgroundColor: "#FFFFFF",
    padding: 10
  },
  animation: {
    enter: "slide-left",
    exit: "fade",
    duration: 500
  },
  globalTransform: {
    x: 0,
    y: 0,
    scale: 1
  }
};
