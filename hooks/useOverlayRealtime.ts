import { useEffect } from 'react';
import { createClient } from '../lib/supabase/client';
import { OverlayData } from '../types/overlay';

export function useOverlayRealtime(slug: string, onUpdate: (newData: OverlayData) => void) {
  useEffect(() => {
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug, onUpdate]);
}
