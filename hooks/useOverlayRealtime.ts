import { useEffect } from 'react';
import { createClient } from '../lib/supabase/client';
import { OverlayData } from '../types/overlay';

export function useOverlayRealtime(
  slug: string,
  overlayId: string | undefined,
  onUpdate: (newData: OverlayData) => void,
  onRefetch?: () => Promise<void>
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
          event: '*',
          schema: 'public',
          table: 'variations'
        },
        async (payload: any) => {
          if (payload.new?.overlay_id === overlayId || payload.old?.overlay_id === overlayId) {
            if (onRefetch) {
              await onRefetch();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug, overlayId, onUpdate, onRefetch]);
}
