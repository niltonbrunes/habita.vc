export type PropertyPattern = 'economic' | 'medium' | 'high_end';
export type PropertyStatus = 'available' | 'reserved' | 'sold';
export type LeadStatus = 'lead' | 'contact' | 'presentation' | 'visit' | 'proposal' | 'sale' | 'lost';
export type UserRole = 'broker' | 'manager' | 'director' | 'admin';
export type BrokerFocus = 'resale' | 'launch' | 'hybrid';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  earnings_goal_monthly: number;
  avg_ticket: number;
  avg_commission_percent: number;
  conversion_rates: {
    lead_to_contact: number;
    contact_to_visit: number;
    visit_to_proposal: number;
    proposal_to_sale: number;
  };
  focus: BrokerFocus;
  high_end_mode: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface Property {
  id: string;
  registered_by_id: string;
  development_id?: string | null;
  title: string;
  description: string;
  reference?: string;
  transaction_type: 'sale' | 'rent' | 'both';
  property_category: 'residential' | 'commercial';
  type: string;
  price: number;
  price_rent?: number;
  price_iptu?: number;
  price_condo?: number;
  area_total: number;
  area_useful: number;
  rooms: number;
  suites: number;
  bathrooms: number;
  parking_spaces: number;
  status: PropertyStatus;
  pattern: PropertyPattern;
  address_street: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city: string;
  address_state: string;
  address_zip_code?: string;
  latitude?: string;
  longitude?: string;
  video_url?: string;
  tour_360_url?: string;
  is_highlight: boolean;
  metadata: any;
  images: string[];
  main_image?: string;
  commission_estimated_percent?: number;
  accepts_financing?: boolean;
  accepts_exchange?: boolean;
  is_unit_of_development?: boolean;
  development?: Development & { developer?: Developer };
  created_at: string;
}

export interface Lead {
  id: string;
  assigned_to_id: string;
  name: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  score: number;
  temperature: 'cold' | 'warm' | 'hot';
  source?: string;
  history: any[];
  documents: any[];
  created_at: string;
}

export interface Developer {
  id: string;
  name: string;
  pattern: PropertyPattern;
  logo_url?: string;
}

export interface Development {
  id: string;
  developer_id: string;
  name: string;
  tagline: string;
  description: string;
  image_url: string;
  gallery: string[];
  features: string[];
  location_address: string;
  location_city: string;
  price_starting_at: number;
  commercial_stage?: 'pre_launch' | 'launch' | 'construction' | 'ready';
  video_url?: string;
  launch_date?: string;
  developer?: Developer;
  created_at: string;
}

export type TaskCategory = 'business' | 'personal' | 'meeting' | 'visit' | 'followup';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  lead_id?: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  due_date: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface Sale {
  id: string;
  lead_id: string;
  property_id: string;
  broker_id: string;
  manager_id?: string;
  sale_price: number;
  total_commission: number;
  broker_commission: number;
  manager_commission: number;
  split_type: 'resale' | 'development' | 'direct';
  split_metadata: any;
  sale_date: string;
  created_at: string;
}
