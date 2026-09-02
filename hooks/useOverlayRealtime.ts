import { useEffect } from 'react';
import { createClient } from '../lib/supabase/client';
import { OverlayData } from '../types/overlay';

export function useOverlayRealtime(
  slug: string,
  overlayId: string | undefined,
  onUpdate: (newData: OverlayData | ((prev: OverlayData | null) => OverlayData | null)) => void
) {
  useEffect(() => {
    if (!overlayId) {
      console.log('[Realtime] Skipping - no overlayId');
      return;
    }

    console.log('[Realtime] Setting up realtime listener for:', { slug, overlayId });
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
          // Merge with existing state to preserve variations array
          onUpdate((prev) => {
            if (!prev) return payload.new as OverlayData;
            return {
              ...payload.new,
              variations: prev.variations // Keep existing variations
            } as OverlayData;
          });
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
          console.log('[Realtime] Variation UPDATE event:', payload);
          if (payload.new?.overlay_id === overlayId) {
            console.log('[Realtime] Updating variation:', payload.new.id, 'is_active:', payload.new.is_active);
            onUpdate((prev) => {
              if (!prev || !prev.variations) return prev;
              const variationIndex = prev.variations.findIndex(v => v.id === payload.new.id);
              if (variationIndex >= 0) {
                const updated = [...prev.variations];
                updated[variationIndex] = payload.new;
                console.log('[Realtime] Updated variations array:', updated);
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
