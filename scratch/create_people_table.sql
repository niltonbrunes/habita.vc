-- 1. Criação da tabela unificada de Pessoas
CREATE TABLE people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_type text NOT NULL CHECK (person_type IN ('PF', 'PJ')),
  
  -- Informações Básicas
  name text NOT NULL, -- Nome Completo (PF) ou Razão Social (PJ)
  fantasy_name text, -- Nome Fantasia (apenas PJ)
  document_id text UNIQUE, -- CPF ou CNPJ (unique para evitar duplicidade)
  rg_ie text, -- RG (PF) ou Inscrição Estadual (PJ)
  im text, -- Inscrição Municipal (apenas PJ)
  birth_date_or_foundation date, -- Data de Nascimento (PF) ou Fundação (PJ)
  marital_status text, -- Estado Civil (apenas PF)
  nationality text, -- Nacionalidade (apenas PF)
  profession text, -- Profissão (apenas PF)
  avatar_url text, -- Foto de perfil/logo
  
  -- Classificação
  roles text[] DEFAULT '{}', -- Array de roles: 'lead', 'client', 'owner', 'broker', etc.
  relationship_status text DEFAULT 'novo', -- 'novo', 'em_atendimento', 'ativo', 'inativo'
  
  -- JSONBs estruturados
  commercial_info jsonb DEFAULT '{}'::jsonb, -- Interesses, origem, faixa de valor
  contacts jsonb DEFAULT '[]'::jsonb, -- Array de { type: 'whatsapp', value: '...' }
  addresses jsonb DEFAULT '[]'::jsonb, -- Array de { type: 'residencial', cep: '...' }
  documents jsonb DEFAULT '[]'::jsonb, -- Array de documentos vinculados
  responsibles jsonb DEFAULT '[]'::jsonb, -- Para PJ: IDs das pessoas físicas responsáveis
  history jsonb DEFAULT '[]'::jsonb, -- Timeline e log de anotações
  
  -- Metadata extra para suportar qualquer campo futuro (escalabilidade de importação)
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Controle e CRM
  assigned_to_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Corretor responsável pelo atendimento
  registered_by_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Política simples (como estamos em um CRM interno, permitir acesso aos usuários autenticados)
CREATE POLICY "Acesso total a usuarios autenticados para pessoas"
  ON people FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Atualizar a tabela de relacionamentos (proprietários/responsáveis por imóveis)
-- Como a tabela `property_owners` já existe, vamos alterá-la para suportar person_id
ALTER TABLE property_owners ADD COLUMN IF NOT EXISTS person_id uuid REFERENCES people(id) ON DELETE CASCADE;

-- Expandir os tipos de vínculo aceitos no campo owner_type (se houver check constraint, talvez precise ser recriada. Senão, ok).
-- Nota: Caso receba erro em "owner_type", ignore, pois vamos preencher via código.

-- 4. Notificar a API para recarregar as tabelas
NOTIFY pgrst, 'reload schema';
