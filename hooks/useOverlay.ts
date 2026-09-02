import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '../lib/supabase/client';
import { OverlayData, OverlayConfig, VariationData } from '../types/overlay';
import { DEFAULT_OVERLAY_CONFIG } from '../lib/overlay-defaults';

function mergeConfig(dbConfig: any): OverlayConfig {
  const defaults = DEFAULT_OVERLAY_CONFIG;
  if (!dbConfig || typeof dbConfig !== 'object') return defaults;

  const baseConfig: OverlayConfig = {
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
        textTransform: dbConfig.texts?.title?.textTransform ?? 'none',
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
        textTransform: dbConfig.texts?.subtitle?.textTransform ?? 'none',
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
        textTransform: dbConfig.texts?.topText?.textTransform ?? 'none',
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
        textTransform: dbConfig.texts?.bottomText?.textTransform ?? 'none',
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
      locked: dbConfig.topBar?.locked !== undefined ? dbConfig.topBar.locked : (defaults.topBar.locked ?? false),
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
      locked: dbConfig.contentBox?.locked !== undefined ? dbConfig.contentBox.locked : (defaults.contentBox.locked ?? false),
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
      locked: dbConfig.bottomBar?.locked !== undefined ? dbConfig.bottomBar.locked : (defaults.bottomBar.locked ?? false),
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

  return baseConfig;
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
      console.log('[fetchOverlay] Fetching overlay with slug:', slug);

      // Fetch overlay without variations JOIN (separate query)
      const overlayResult = await supabase
        .from('overlays')
        .select('id, slug, name, config, is_active, created_at, updated_at')
        .eq('slug', slug)
        .single();

      console.log('[fetchOverlay] Result:', overlayResult);

      if (overlayResult.error) {
        if (overlayResult.error.code === 'PGRST116') {
          // Not found - create default overlay + initial variation
          const defaultOverlay = {
            slug,
            name: slug.toUpperCase().replace(/-/g, ' '),
            config: DEFAULT_OVERLAY_CONFIG,
            is_active: false
          };

          const { data: insertedData, error: insertError } = await supabase
            .from('overlays')
            .insert([defaultOverlay])
            .select('id, slug, name, config, is_active, created_at, updated_at')
            .single();

          if (insertError) {
            // If overlay already exists (duplicate key), fetch it instead
            if (insertError.code === '23505') {
              console.log('Overlay already exists, fetching it...');
              const existingResult = await supabase
                .from('overlays')
                .select('id, slug, name, config, is_active, created_at, updated_at')
                .eq('slug', slug)
                .single();
              if (existingResult.error) throw existingResult.error;

              const data = existingResult.data as any;
              if (data?.id) {
                const variationsResult = await supabase
                  .from('variations')
                  .select('id, overlay_id, name, is_active, config, order_index, created_at, updated_at')
                  .eq('overlay_id', data.id)
                  .order('order_index', { ascending: true });

                data.variations = variationsResult.data || [];
              }
              setOverlay(data);
              return;
            }
            throw insertError;
          }

          // Create initial variation for this overlay
          if (insertedData?.id) {
            const defaultVariation = {
              overlay_id: insertedData.id,
              name: 'Variação Padrão',
              is_active: true,
              config: {
                topBar: DEFAULT_OVERLAY_CONFIG.topBar,
                contentBox: DEFAULT_OVERLAY_CONFIG.contentBox,
                bottomBar: DEFAULT_OVERLAY_CONFIG.bottomBar,
                texts: DEFAULT_OVERLAY_CONFIG.texts,
                logo: DEFAULT_OVERLAY_CONFIG.logo,
                globalTransform: DEFAULT_OVERLAY_CONFIG.globalTransform
              },
              order_index: 0
            };

            const { data: variation, error: variationError } = await supabase
              .from('variations')
              .insert([defaultVariation])
              .select()
              .single();

            if (!variationError && variation) {
              (insertedData as any).variations = [variation];
            } else {
              (insertedData as any).variations = [];
            }
          }

          setOverlay(insertedData as any);
        } else {
          throw overlayResult.error;
        }
      } else {
        // Fetch variations separately
        const data = overlayResult.data as any;

        if (data?.id) {
          const variationsResult = await supabase
            .from('variations')
            .select('id, overlay_id, name, is_active, config, order_index, created_at, updated_at')
            .eq('overlay_id', data.id)
            .order('order_index', { ascending: true });

          if (!variationsResult.error && variationsResult.data) {
            data.variations = variationsResult.data;
          } else {
            data.variations = [];
          }
        } else {
          data.variations = [];
        }

        setOverlay(data);
      }
    } catch (err: any) {
      console.error('Error fetching overlay:', err);
      setError(err.message || 'Erro ao carregar overlay');
    } finally {
      setLoading(false);
    }
  }, [slug, supabase, setOverlay]);

  // SEPARATE DEBOUNCE TIMERS BY ENTITY
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<Partial<OverlayData>>({});

  // Map of timers for per-variation updates
  const variationTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const pendingVariationUpdatesRef = useRef<Map<string, Partial<VariationData>>>(new Map());

  const saveToSupabase = async (payload: Partial<OverlayData>) => {
    try {
      const { error } = await supabase
        .from('overlays')
        .update(payload)
        .eq('slug', slug);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error saving overlay:', err);
      setError(err.message || 'Erro ao atualizar overlay');
      fetchOverlay();
    }
  };

  const saveVariationToSupabase = async (id: string, payload: Partial<VariationData>) => {
    try {
      const { error } = await supabase
        .from('variations')
        .update(payload)
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      console.error(`Error saving variation ${id}:`, err);
      setError(err.message || 'Erro ao atualizar variação');
      fetchOverlay();
    }
  };

  // ROOT-LEVEL CONFIG UPDATES (debounced 1s)
  const updateOverlay = async (updates: Partial<OverlayData>) => {
    if (!overlay) return;
    try {
      setOverlay(prev => prev ? { ...prev, ...updates } : null);

      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates };

      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }

      updateTimerRef.current = setTimeout(async () => {
        const payloadToSave = { ...pendingUpdatesRef.current };
        pendingUpdatesRef.current = {};
        await saveToSupabase(payloadToSave);
      }, 1000);
    } catch (err: any) {
      console.error('Error in updateOverlay:', err);
      setError(err.message || 'Erro ao atualizar overlay');
      fetchOverlay();
    }
  };

  // PER-VARIATION CONFIG UPDATES (debounced 1s per variation)
  const updateVariationConfig = async (id: string, updates: Partial<VariationData>) => {
    if (!overlay) return;
    try {
      setOverlay(prev => {
        if (!prev) return null;
        return {
          ...prev,
          variations: prev.variations?.map(v => v.id === id ? { ...v, ...updates } : v)
        };
      });

      const currentPending = pendingVariationUpdatesRef.current.get(id) || {};
      pendingVariationUpdatesRef.current.set(id, { ...currentPending, ...updates });

      const existingTimer = variationTimersRef.current.get(id);
      if (existingTimer) clearTimeout(existingTimer);

      const newTimer = setTimeout(async () => {
        const payloadToSave = pendingVariationUpdatesRef.current.get(id);
        if (payloadToSave) {
          pendingVariationUpdatesRef.current.delete(id);
          await saveVariationToSupabase(id, payloadToSave);
        }
        variationTimersRef.current.delete(id);
      }, 1000);

      variationTimersRef.current.set(id, newTimer);
    } catch (err: any) {
      console.error(`Error in updateVariationConfig(${id}):`, err);
      setError(err.message || 'Erro ao atualizar variação');
      fetchOverlay();
    }
  };

  // IMMEDIATE VARIATION UPDATES (flush any pending + new updates)
  const flushVariationUpdate = async (id: string, updates: Partial<VariationData>) => {
    if (!overlay) return;
    try {
      setOverlay(prev => {
        if (!prev) return null;
        return {
          ...prev,
          variations: prev.variations?.map(v => v.id === id ? { ...v, ...updates } : v)
        };
      });

      const existingTimer = variationTimersRef.current.get(id);
      if (existingTimer) {
        clearTimeout(existingTimer);
        variationTimersRef.current.delete(id);
      }

      const pending = pendingVariationUpdatesRef.current.get(id) || {};
      pendingVariationUpdatesRef.current.delete(id);
      const combined = { ...pending, ...updates };

      await saveVariationToSupabase(id, combined);
    } catch (err: any) {
      console.error(`Error in flushVariationUpdate(${id}):`, err);
      setError(err.message || 'Erro ao atualizar variação');
      fetchOverlay();
    }
  };

  // CREATE VARIATION (immediate insert into variations table)
  const createVariation = async (variation: Omit<VariationData, 'id' | 'created_at' | 'updated_at' | 'order_index'>) => {
    if (!overlay) return;
    try {
      const maxOrder = Math.max(
        ...(overlay.variations?.map(v => v.order_index) ?? [0])
      );
      const nextOrder = maxOrder + 1;

      const { data: insertedVariation, error } = await supabase
        .from('variations')
        .insert([
          {
            ...variation,
            overlay_id: overlay.id,
            order_index: nextOrder
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setOverlay(prev => {
        if (!prev) return null;
        return {
          ...prev,
          variations: [...(prev.variations ?? []), insertedVariation as VariationData]
        };
      });

      return insertedVariation as VariationData;
    } catch (err: any) {
      console.error('Error creating variation:', err);
      setError(err.message || 'Erro ao criar variação');
      fetchOverlay();
    }
  };

  // DELETE VARIATION (immediate delete from variations table)
  const deleteVariation = async (id: string) => {
    if (!overlay) return;
    try {
      const existingTimer = variationTimersRef.current.get(id);
      if (existingTimer) {
        clearTimeout(existingTimer);
        variationTimersRef.current.delete(id);
      }
      pendingVariationUpdatesRef.current.delete(id);

      const { error } = await supabase
        .from('variations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setOverlay(prev => {
        if (!prev) return null;
        return {
          ...prev,
          variations: prev.variations?.filter(v => v.id !== id)
        };
      });
    } catch (err: any) {
      console.error('Error deleting variation:', err);
      setError(err.message || 'Erro ao excluir variação');
      fetchOverlay();
    }
  };

  // LEGACY: FLUSH AND UPDATE (immediate for root-level changes)
  const flushAndUpdate = async (updates: Partial<OverlayData>) => {
    if (!overlay) return;
    try {
      setOverlay(prev => prev ? { ...prev, ...updates } : null);

      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
        updateTimerRef.current = null;
      }

      const combined = { ...pendingUpdatesRef.current, ...updates };
      pendingUpdatesRef.current = {};

      await saveToSupabase(combined);
    } catch (err: any) {
      console.error('Error in flushAndUpdate:', err);
      setError(err.message || 'Erro ao atualizar overlay');
      fetchOverlay();
    }
  };

  useEffect(() => {
    fetchOverlay();
  }, [fetchOverlay]);

  useEffect(() => {
    return () => {
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
      variationTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return {
    overlay,
    setOverlay,
    loading,
    error,
    updateOverlay,
    flushAndUpdate,
    updateVariationConfig,
    flushVariationUpdate,
    createVariation,
    deleteVariation,
    refetch: fetchOverlay
  };
}
