export type PersonType = 'PF' | 'PJ';
export type PersonRole = 'lead' | 'client' | 'owner' | 'broker' | 'tenant' | 'guarantor' | 'proxy' | 'company' | 'partner';
export type RelationshipStatus = 'novo' | 'em_atendimento' | 'ativo' | 'inativo';

export interface PersonContact {
  id: string;
  type: 'whatsapp' | 'phone' | 'email' | 'website' | 'other';
  value: string;
  is_primary: boolean;
}

export interface PersonAddress {
  id: string;
  type: 'residential' | 'commercial' | 'correspondence';
  zip_code: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  is_primary: boolean;
}

export interface PersonCommercialInfo {
  lead_source?: string;
  interests?: ('buy' | 'rent' | 'sell')[];
  target_price_min?: number;
  target_price_max?: number;
  notes?: string;
}

export interface PersonResponsible {
  person_id?: string; // Se já existir na base
  name: string;       // Nome caso não esteja na base (opcional/legado)
  role: string;       // e.g., 'Sócio', 'Administrador', 'Procurador'
}

export interface PersonDocument {
  id: string;
  name: string;
  url: string;
  doc_type: string;
  file_size?: number;
  created_at: string;
}

export interface PersonHistoryEntry {
  id: string;
  type: 'note' | 'call' | 'meeting' | 'email' | 'whatsapp' | 'system';
  content: string;
  created_by_id: string;
  created_at: string;
}

export interface Person {
  id: string;
  person_type: PersonType;
  
  // Basic Info (PF/PJ shared or specific)
  name: string;
  fantasy_name?: string | null;
  document_id?: string | null; // CPF or CNPJ
  rg_ie?: string | null;
  im?: string | null;
  birth_date_or_foundation?: string | null;
  marital_status?: string | null;
  nationality?: string | null;
  profession?: string | null;
  avatar_url?: string | null;
  
  // Classification
  roles: PersonRole[];
  relationship_status: RelationshipStatus;
  
  // JSONB Structures
  commercial_info: PersonCommercialInfo;
  contacts: PersonContact[];
  addresses: PersonAddress[];
  documents: PersonDocument[];
  responsibles: PersonResponsible[]; // For PJ
  history: PersonHistoryEntry[];
  metadata: Record<string, any>; // Extra import fields
  
  // System
  assigned_to_id?: string;
  registered_by_id?: string;
  created_at: string;
  updated_at: string;
}
