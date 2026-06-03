-- =====================================================================
-- Migration: Seller Lead Journey (Captação de Imóveis)
-- Date: 2026-06-02
-- =====================================================================

-- 1. Add lead_type to distinguish buyer vs seller leads
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS lead_type TEXT DEFAULT 'buyer'
    CHECK (lead_type IN ('buyer', 'seller'));

-- 2. Extend status check to include seller pipeline stages
-- We drop the old constraint and create a new one that covers both pipelines
ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_status_check
    CHECK (status IN (
      -- Buyer pipeline
      'lead', 'contact', 'presentation', 'visit', 'proposal', 'sale', 'lost',
      -- Seller pipeline (captação)
      'prospecting', 'contacted', 'visit_scheduled', 'visited', 'proposal_sent', 'captured'
    ));

-- 3. Add seller-specific fields (all optional, only used when lead_type = 'seller')
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS seller_property_address   TEXT,
  ADD COLUMN IF NOT EXISTS seller_property_type      TEXT,
  ADD COLUMN IF NOT EXISTS seller_asking_price       NUMERIC,
  ADD COLUMN IF NOT EXISTS seller_motivation         TEXT,
  ADD COLUMN IF NOT EXISTS seller_property_area      NUMERIC,
  ADD COLUMN IF NOT EXISTS seller_rooms              INT;

-- 4. Add 'suspended' status to properties (for newly captured properties awaiting commercial prep)
ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_status_check;

ALTER TABLE public.properties
  ADD CONSTRAINT properties_status_check
    CHECK (status IN ('available', 'reserved', 'sold', 'rented', 'inactive', 'suspended'));

-- 5. Index for fast filtering by type
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON public.leads(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_lead_type_status ON public.leads(lead_type, status);

COMMENT ON COLUMN public.leads.lead_type IS 'buyer = quer comprar | seller = quer vender (pipeline de captação)';
COMMENT ON COLUMN public.leads.seller_property_address IS 'Endereço do imóvel que o proprietário deseja vender';
COMMENT ON COLUMN public.leads.seller_property_type IS 'Tipo do imóvel: Apartamento, Casa, Terreno, etc.';
COMMENT ON COLUMN public.leads.seller_asking_price IS 'Preço que o proprietário deseja obter na venda';
COMMENT ON COLUMN public.leads.seller_motivation IS 'Motivação da venda: mudança, herança, financeiro, investimento';
