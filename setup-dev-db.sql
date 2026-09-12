-- Crie a tabela `overlays_dev`
CREATE TABLE public.overlays_dev (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  slug text NOT NULL,
  name text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  CONSTRAINT overlays_dev_pkey PRIMARY KEY (id),
  CONSTRAINT overlays_dev_slug_key UNIQUE (slug)
) TABLESPACE pg_default;

-- Crie a tabela `variations_dev`
CREATE TABLE public.variations_dev (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  overlay_id uuid NOT NULL,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  CONSTRAINT variations_dev_pkey PRIMARY KEY (id),
  CONSTRAINT variations_dev_overlay_id_fkey FOREIGN KEY (overlay_id) REFERENCES overlays_dev (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Habilitar o Realtime para as tabelas DEV
ALTER PUBLICATION supabase_realtime ADD TABLE public.overlays_dev;
ALTER PUBLICATION supabase_realtime ADD TABLE public.variations_dev;
