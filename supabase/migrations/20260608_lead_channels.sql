-- Create lead_channels table
CREATE TABLE IF NOT EXISTS public.lead_channels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.lead_channels ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access to authenticated users" 
    ON public.lead_channels FOR SELECT 
    TO authenticated 
    USING (true);

-- Insert standard channels
INSERT INTO public.lead_channels (id, name) VALUES
    ('indicacao', 'Indicação'),
    ('base_clientes', 'Base de Clientes'),
    ('network', 'Network'),
    ('portais', 'Portais'),
    ('redes_sociais', 'Redes Sociais'),
    ('ligacao_ativa', 'Ligação Ativa'),
    ('ponto_avancado', 'Ponto Avançado'),
    ('ia_prospeccao', 'IA Prospecção'),
    ('manual', 'Manual'),
    ('plantao', 'Plantão'),
    ('acao_vendas', 'Ação de Vendas'),
    ('outros', 'Outros')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Normalize existing data in public.leads (source column)
UPDATE public.leads
SET source = 
  CASE 
    WHEN source ILIKE '%indica%' THEN 'indicacao'
    WHEN source ILIKE '%base%cliente%' OR source ILIKE '%base_cliente%' THEN 'base_clientes'
    WHEN source ILIKE '%network%' THEN 'network'
    WHEN source ILIKE '%portal%' THEN 'portais'
    WHEN source ILIKE '%rede%socia%' THEN 'redes_sociais'
    WHEN source ILIKE '%liga%ativa%' THEN 'ligacao_ativa'
    WHEN source ILIKE '%ponto%avan%' THEN 'ponto_avancado'
    WHEN source ILIKE '%ia%prospec%' THEN 'ia_prospeccao'
    WHEN source ILIKE '%manual%' THEN 'manual'
    WHEN source ILIKE '%plantao%' THEN 'plantao'
    WHEN source ILIKE '%acao%venda%' THEN 'acao_vendas'
    ELSE 'outros'
  END
WHERE source IS NOT NULL;

-- Normalize existing data in public.people (commercial_info -> lead_source)
UPDATE public.people
SET commercial_info = jsonb_set(
  commercial_info, 
  '{lead_source}', 
  to_jsonb(
    CASE 
      WHEN commercial_info->>'lead_source' ILIKE '%indica%' THEN 'indicacao'
      WHEN commercial_info->>'lead_source' ILIKE '%base%cliente%' OR commercial_info->>'lead_source' ILIKE '%base_cliente%' THEN 'base_clientes'
      WHEN commercial_info->>'lead_source' ILIKE '%network%' THEN 'network'
      WHEN commercial_info->>'lead_source' ILIKE '%portal%' THEN 'portais'
      WHEN commercial_info->>'lead_source' ILIKE '%rede%socia%' THEN 'redes_sociais'
      WHEN commercial_info->>'lead_source' ILIKE '%liga%ativa%' THEN 'ligacao_ativa'
      WHEN commercial_info->>'lead_source' ILIKE '%ponto%avan%' THEN 'ponto_avancado'
      WHEN commercial_info->>'lead_source' ILIKE '%ia%prospec%' THEN 'ia_prospeccao'
      WHEN commercial_info->>'lead_source' ILIKE '%manual%' THEN 'manual'
      WHEN commercial_info->>'lead_source' ILIKE '%plantao%' THEN 'plantao'
      WHEN commercial_info->>'lead_source' ILIKE '%acao%venda%' THEN 'acao_vendas'
      ELSE 'outros'
    END
  )
)
WHERE commercial_info->>'lead_source' IS NOT NULL;
