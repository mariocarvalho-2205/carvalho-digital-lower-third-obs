import { useEffect, useState, useCallback } from 'react';
import { createClient } from '../lib/supabase/client';
import { OverlayData, OverlayConfig } from '../types/overlay';
import { DEFAULT_OVERLAY_CONFIG } from '../lib/overlay-defaults';

function mergeConfig(dbConfig: any): OverlayConfig {
  const defaults = DEFAULT_OVERLAY_CONFIG;
  if (!dbConfig || typeof dbConfig !== 'object') return defaults;

  return {
    canvas: {
      width: dbConfig.canvas?.width ?? defaults.canvas.width,
      height: dbConfig.canvas?.height ?? defaults.canvas.height,
    },
    texts: {
      title: {
        content: dbConfig.texts?.title?.content ?? defaults.texts.title.content,
        x: dbConfig.texts?.title?.x ?? defaults.texts.title.x,
        y: dbConfig.texts?.title?.y ?? defaults.texts.title.y,
        fontSize: dbConfig.texts?.title?.fontSize ?? defaults.texts.title.fontSize,
        fontWeight: dbConfig.texts?.title?.fontWeight ?? defaults.texts.title.fontWeight,
        color: dbConfig.texts?.title?.color !== undefined ? dbConfig.texts.title.color : defaults.texts.title.color,
        fontFamily: dbConfig.texts?.title?.fontFamily ?? defaults.texts.title.fontFamily,
        maxWidth: dbConfig.texts?.title?.maxWidth ?? 0,
        scrollEnabled: dbConfig.texts?.title?.scrollEnabled ?? false,
        scrollSpeed: dbConfig.texts?.title?.scrollSpeed ?? 20,
        scrollSeparatorLogoUrl: dbConfig.texts?.title?.scrollSeparatorLogoUrl ?? null,
        scrollSeparatorLogoWidth: dbConfig.texts?.title?.scrollSeparatorLogoWidth ?? 24,
        scrollSeparatorLogoHeight: dbConfig.texts?.title?.scrollSeparatorLogoHeight ?? 24,
        scrollSeparatorMargin: dbConfig.texts?.title?.scrollSeparatorMargin ?? 30,
      },
      subtitle: {
        content: dbConfig.texts?.subtitle?.content ?? defaults.texts.subtitle.content,
        x: dbConfig.texts?.subtitle?.x ?? defaults.texts.subtitle.x,
        y: dbConfig.texts?.subtitle?.y ?? defaults.texts.subtitle.y,
        fontSize: dbConfig.texts?.subtitle?.fontSize ?? defaults.texts.subtitle.fontSize,
        fontWeight: dbConfig.texts?.subtitle?.fontWeight ?? defaults.texts.subtitle.fontWeight,
        color: dbConfig.texts?.subtitle?.color !== undefined ? dbConfig.texts.subtitle.color : defaults.texts.subtitle.color,
        fontFamily: dbConfig.texts?.subtitle?.fontFamily ?? defaults.texts.subtitle.fontFamily,
        maxWidth: dbConfig.texts?.subtitle?.maxWidth ?? 0,
        scrollEnabled: dbConfig.texts?.subtitle?.scrollEnabled ?? false,
        scrollSpeed: dbConfig.texts?.subtitle?.scrollSpeed ?? 20,
        scrollSeparatorLogoUrl: dbConfig.texts?.subtitle?.scrollSeparatorLogoUrl ?? null,
        scrollSeparatorLogoWidth: dbConfig.texts?.subtitle?.scrollSeparatorLogoWidth ?? 24,
        scrollSeparatorLogoHeight: dbConfig.texts?.subtitle?.scrollSeparatorLogoHeight ?? 24,
        scrollSeparatorMargin: dbConfig.texts?.subtitle?.scrollSeparatorMargin ?? 30,
      },
      topText: {
        content: dbConfig.texts?.topText?.content ?? defaults.texts.topText?.content ?? "AO VIVO",
        x: dbConfig.texts?.topText?.x ?? defaults.texts.topText?.x ?? 245,
        y: dbConfig.texts?.topText?.y ?? defaults.texts.topText?.y ?? 642,
        fontSize: dbConfig.texts?.topText?.fontSize ?? defaults.texts.topText?.fontSize ?? 22,
        fontWeight: dbConfig.texts?.topText?.fontWeight ?? defaults.texts.topText?.fontWeight ?? 700,
        color: dbConfig.texts?.topText?.color !== undefined ? dbConfig.texts.topText.color : (defaults.texts.topText?.color ?? "#FFFFFF"),
        fontFamily: dbConfig.texts?.topText?.fontFamily ?? defaults.texts.topText?.fontFamily ?? "Arial",
        maxWidth: dbConfig.texts?.topText?.maxWidth ?? 0,
        scrollEnabled: dbConfig.texts?.topText?.scrollEnabled ?? false,
        scrollSpeed: dbConfig.texts?.topText?.scrollSpeed ?? 20,
        scrollSeparatorLogoUrl: dbConfig.texts?.topText?.scrollSeparatorLogoUrl ?? null,
        scrollSeparatorLogoWidth: dbConfig.texts?.topText?.scrollSeparatorLogoWidth ?? 24,
        scrollSeparatorLogoHeight: dbConfig.texts?.topText?.scrollSeparatorLogoHeight ?? 24,
        scrollSeparatorMargin: dbConfig.texts?.topText?.scrollSeparatorMargin ?? 30,
      },
      bottomText: {
        content: dbConfig.texts?.bottomText?.content ?? defaults.texts.bottomText?.content ?? "CARVALHO DIGITAL STREAM",
        x: dbConfig.texts?.bottomText?.x ?? defaults.texts.bottomText?.x ?? 245,
        y: dbConfig.texts?.bottomText?.y ?? defaults.texts.bottomText?.y ?? 838,
        fontSize: dbConfig.texts?.bottomText?.fontSize ?? defaults.texts.bottomText?.fontSize ?? 18,
        fontWeight: dbConfig.texts?.bottomText?.fontWeight ?? defaults.texts.bottomText?.fontWeight ?? 600,
        color: dbConfig.texts?.bottomText?.color !== undefined ? dbConfig.texts.bottomText.color : (defaults.texts.bottomText?.color ?? "#FFFFFF"),
        fontFamily: dbConfig.texts?.bottomText?.fontFamily ?? defaults.texts.bottomText?.fontFamily ?? "Arial",
        maxWidth: dbConfig.texts?.bottomText?.maxWidth ?? 0,
        scrollEnabled: dbConfig.texts?.bottomText?.scrollEnabled ?? false,
        scrollSpeed: dbConfig.texts?.bottomText?.scrollSpeed ?? 20,
        scrollSeparatorLogoUrl: dbConfig.texts?.bottomText?.scrollSeparatorLogoUrl ?? null,
        scrollSeparatorLogoWidth: dbConfig.texts?.bottomText?.scrollSeparatorLogoWidth ?? 24,
        scrollSeparatorLogoHeight: dbConfig.texts?.bottomText?.scrollSeparatorLogoHeight ?? 24,
        scrollSeparatorMargin: dbConfig.texts?.bottomText?.scrollSeparatorMargin ?? 30,
      },
    },
    topBar: {
      x: dbConfig.topBar?.x ?? defaults.topBar.x,
      y: dbConfig.topBar?.y ?? defaults.topBar.y,
      width: dbConfig.topBar?.width ?? defaults.topBar.width,
      height: dbConfig.topBar?.height ?? defaults.topBar.height,
      background: {
        type: dbConfig.topBar?.background?.type ?? defaults.topBar.background.type,
        color: dbConfig.topBar?.background?.color ?? defaults.topBar.background.color,
        start: dbConfig.topBar?.background?.start ?? defaults.topBar.background.start,
        end: dbConfig.topBar?.background?.end ?? defaults.topBar.background.end,
        direction: dbConfig.topBar?.background?.direction ?? defaults.topBar.background.direction,
      },
      radius: {
        topLeft: dbConfig.topBar?.radius?.topLeft ?? defaults.topBar.radius.topLeft,
        topRight: dbConfig.topBar?.radius?.topRight ?? defaults.topBar.radius.topRight,
        bottomRight: dbConfig.topBar?.radius?.bottomRight ?? defaults.topBar.radius.bottomRight,
        bottomLeft: dbConfig.topBar?.radius?.bottomLeft ?? defaults.topBar.radius.bottomLeft,
      },
      enabled: dbConfig.topBar?.enabled !== undefined ? dbConfig.topBar.enabled : (defaults.topBar.enabled ?? true),
    },
    contentBox: {
      x: dbConfig.contentBox?.x ?? defaults.contentBox.x,
      y: dbConfig.contentBox?.y ?? defaults.contentBox.y,
      width: dbConfig.contentBox?.width ?? defaults.contentBox.width,
      height: dbConfig.contentBox?.height ?? defaults.contentBox.height,
      background: dbConfig.contentBox?.background !== undefined ? dbConfig.contentBox.background : defaults.contentBox.background,
      radius: {
        topLeft: dbConfig.contentBox?.radius?.topLeft ?? defaults.contentBox.radius.topLeft,
        topRight: dbConfig.contentBox?.radius?.topRight ?? defaults.contentBox.radius.topRight,
        bottomRight: dbConfig.contentBox?.radius?.bottomRight ?? defaults.contentBox.radius.bottomRight,
        bottomLeft: dbConfig.contentBox?.radius?.bottomLeft ?? defaults.contentBox.radius.bottomLeft,
      },
      opacity: dbConfig.contentBox?.opacity ?? defaults.contentBox.opacity,
      enabled: dbConfig.contentBox?.enabled !== undefined ? dbConfig.contentBox.enabled : (defaults.contentBox.enabled ?? true),
    },
    bottomBar: {
      x: dbConfig.bottomBar?.x ?? defaults.bottomBar.x,
      y: dbConfig.bottomBar?.y ?? defaults.bottomBar.y,
      width: dbConfig.bottomBar?.width ?? defaults.bottomBar.width,
      height: dbConfig.bottomBar?.height ?? defaults.bottomBar.height,
      background: {
        type: dbConfig.bottomBar?.background?.type ?? defaults.bottomBar.background.type,
        color: dbConfig.bottomBar?.background?.color ?? defaults.bottomBar.background.color,
        start: dbConfig.bottomBar?.background?.start ?? defaults.bottomBar.background.start,
        end: dbConfig.bottomBar?.background?.end ?? defaults.bottomBar.background.end,
        direction: dbConfig.bottomBar?.background?.direction ?? defaults.bottomBar.background.direction,
      },
      radius: {
        topLeft: dbConfig.bottomBar?.radius?.topLeft ?? defaults.bottomBar.radius.topLeft,
        topRight: dbConfig.bottomBar?.radius?.topRight ?? defaults.bottomBar.radius.topRight,
        bottomRight: dbConfig.bottomBar?.radius?.bottomRight ?? defaults.bottomBar.radius.bottomRight,
        bottomLeft: dbConfig.bottomBar?.radius?.bottomLeft ?? defaults.bottomBar.radius.bottomLeft,
      },
      enabled: dbConfig.bottomBar?.enabled !== undefined ? dbConfig.bottomBar.enabled : (defaults.bottomBar.enabled ?? true),
    },
    logo: {
      url: dbConfig.logo?.url !== undefined ? dbConfig.logo.url : defaults.logo.url,
      x: dbConfig.logo?.x ?? defaults.logo.x,
      y: dbConfig.logo?.y ?? defaults.logo.y,
      width: dbConfig.logo?.width ?? defaults.logo.width,
      height: dbConfig.logo?.height ?? defaults.logo.height,
      backgroundType: dbConfig.logo?.backgroundType ?? defaults.logo.backgroundType,
      backgroundColor: dbConfig.logo?.backgroundColor ?? defaults.logo.backgroundColor,
      padding: dbConfig.logo?.padding ?? defaults.logo.padding,
    },
    animation: {
      enter: dbConfig.animation?.enter ?? defaults.animation.enter,
      exit: dbConfig.animation?.exit ?? defaults.animation.exit,
      duration: dbConfig.animation?.duration ?? defaults.animation.duration,
    },
    globalTransform: {
      x: dbConfig.globalTransform?.x ?? defaults.globalTransform?.x ?? 0,
      y: dbConfig.globalTransform?.y ?? defaults.globalTransform?.y ?? 0,
      scale: dbConfig.globalTransform?.scale ?? defaults.globalTransform?.scale ?? 1,
    },
  };
}

export function useOverlay(slug: string) {
  const [overlay, setOverlayState] = useState<OverlayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const setOverlay = useCallback((data: OverlayData | null | ((prev: OverlayData | null) => OverlayData | null)) => {
    setOverlayState((prev) => {
      const resolved = typeof data === 'function' ? data(prev) : data;
      if (!resolved) return null;
      return {
        ...resolved,
        config: mergeConfig(resolved.config)
      };
    });
  }, []);

  const fetchOverlay = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('overlays')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        // If not found, try to create standard template
        if (error.code === 'PGRST116') {
          const defaultData: OverlayData = {
            slug,
            name: slug.toUpperCase().replace(/-/g, ' '),
            config: DEFAULT_OVERLAY_CONFIG,
            is_active: false
          };

          const { data: insertedData, error: insertError } = await supabase
            .from('overlays')
            .insert([defaultData])
            .select()
            .single();

          if (insertError) {
            throw insertError;
          }
          setOverlay(insertedData);
        } else {
          throw error;
        }
      } else {
        setOverlay(data);
      }
    } catch (err: any) {
      console.error('Error fetching overlay:', err);
      setError(err.message || 'Erro ao carregar overlay');
    } finally {
      setLoading(false);
    }
  }, [slug, supabase, setOverlay]);

  const updateOverlay = async (updates: Partial<OverlayData>) => {
    if (!overlay) return;
    try {
      // Optimistic update
      setOverlay(prev => prev ? { ...prev, ...updates } : null);

      const { error } = await supabase
        .from('overlays')
        .update(updates)
        .eq('slug', slug);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating overlay:', err);
      setError(err.message || 'Erro ao atualizar overlay');
      // Rollback on error by re-fetching
      fetchOverlay();
    }
  };

  useEffect(() => {
    fetchOverlay();
  }, [fetchOverlay]);

  return { overlay, setOverlay, loading, error, updateOverlay, refetch: fetchOverlay };
}

