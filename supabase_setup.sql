-- Script SQL para ser executado no SQL Editor do Supabase

-- Criar tabela overlays
CREATE TABLE IF NOT EXISTS overlays (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ativar RLS
ALTER TABLE overlays ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Leitura pública para todos" ON overlays 
  FOR SELECT USING (true);

CREATE POLICY "Atualização para todos" ON overlays 
  FOR UPDATE USING (true); -- Mudar para auth.role() = 'authenticated' caso queira segurança completa posteriormente

CREATE POLICY "Inserção para todos" ON overlays 
  FOR INSERT WITH CHECK (true);

-- Ativar replicação em tempo real para a tabela overlays
alter publication supabase_realtime add table overlays;
