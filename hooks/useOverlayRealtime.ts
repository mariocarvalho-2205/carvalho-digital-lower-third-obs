import { useEffect } from 'react';
import { createClient } from '../lib/supabase/client';
import { OverlayData } from '../types/overlay';

export function useOverlayRealtime(
  slug: string,
  overlayId: string | undefined,
  onUpdate: (newData: OverlayData | ((prev: OverlayData | null) => OverlayData | null)) => void
) {
  useEffect(() => {
    if (!overlayId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`overlay_changes:${slug}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'overlays',
          filter: `slug=eq.${slug}`
        },
        (payload) => {
          onUpdate(payload.new as OverlayData);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'variations'
        },
        (payload: any) => {
          if (payload.new?.overlay_id === overlayId) {
            onUpdate((prev) => {
              if (!prev || !prev.variations) return prev;
              return { ...prev, variations: [...prev.variations, payload.new] };
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'variations'
        },
        (payload: any) => {
          if (payload.new?.overlay_id === overlayId) {
            onUpdate((prev) => {
              if (!prev || !prev.variations) return prev;
              const variationIndex = prev.variations.findIndex(v => v.id === payload.new.id);
              if (variationIndex >= 0) {
                const updated = [...prev.variations];
                updated[variationIndex] = payload.new;
                return { ...prev, variations: updated };
              }
              return prev;
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'variations'
        },
        (payload: any) => {
          if (payload.old?.overlay_id === overlayId) {
            onUpdate((prev) => {
              if (!prev || !prev.variations) return prev;
              return {
                ...prev,
                variations: prev.variations.filter(v => v.id !== payload.old.id)
              };
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug, overlayId, onUpdate]);
}
