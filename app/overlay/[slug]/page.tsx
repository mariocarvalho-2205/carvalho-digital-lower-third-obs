'use client';

import { useOverlay } from '@/hooks/useOverlay';
import { useOverlayRealtime } from '@/hooks/useOverlayRealtime';
import { LowerThird } from '@/components/overlay/LowerThird';
import { useParams } from 'next/navigation';

// Inline style tag forces transparent bg from the very first paint (SSR + client).
// The OBS browser source also needs its Custom CSS set to:
//   body { background-color: rgba(0, 0, 0, 0) !important; }
const TRANSPARENT_STYLE = `
  html, body {
    background: transparent !important;
    background-color: transparent !important;
  }
`;

export default function OverlayPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'ba-ao-vivo';

  const { overlay, setOverlay, loading, error } = useOverlay(slug);

  useOverlayRealtime(slug, (newOverlay) => {
    setOverlay(newOverlay);
  });

  // Always render the style tag so the background is transparent from first paint.
  const styleTag = <style dangerouslySetInnerHTML={{ __html: TRANSPARENT_STYLE }} />;

  if (loading || error || !overlay) {
    return <>{styleTag}</>;
  }

  return (
    <>
      {styleTag}
      <main
        className="w-screen h-screen overflow-hidden relative"
        style={{ background: 'transparent' }}
      >
        {overlay.config.variations?.map((variation) => {
          const subConfig = {
            ...overlay.config,
            ...variation,
            canvas: overlay.config.canvas,
            animation: overlay.config.animation,
          };
          return (
            <div key={variation.id} className="absolute inset-0 pointer-events-none">
              <LowerThird config={subConfig} isActive={overlay.is_active && variation.is_active} />
            </div>
          );
        })}
      </main>
    </>
  );
}

