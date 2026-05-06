-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Users of the system)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('broker', 'manager', 'director', 'admin')) DEFAULT 'broker',
    earnings_goal_monthly DECIMAL(12, 2) DEFAULT 0,
    avg_ticket DECIMAL(15, 2) DEFAULT 0,
    avg_commission_percent DECIMAL(5, 2) DEFAULT 0,
    conversion_rates JSONB DEFAULT '{"lead_to_contact": 0, "contact_to_visit": 0, "visit_to_proposal": 0, "proposal_to_sale": 0}',
    focus TEXT CHECK (focus IN ('resale', 'launch', 'hybrid')) DEFAULT 'hybrid',
    high_end_mode BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    slug TEXT UNIQUE,
    bio TEXT,
    whatsapp TEXT,
    instagram TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. OWNERS (The actual property owners)
CREATE TABLE IF NOT EXISTS public.owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. DEVELOPERS (Incorporadoras)
CREATE TABLE IF NOT EXISTS public.developers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    pattern TEXT CHECK (pattern IN ('economic', 'medium', 'high_end')) DEFAULT 'medium',
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. DEVELOPMENTS (Empreendimentos)
CREATE TABLE IF NOT EXISTS public.developments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    developer_id UUID REFERENCES public.developers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    image_url TEXT,
    gallery JSONB DEFAULT '[]',
    price_starting_at DECIMAL(12, 2),
    location_address TEXT,
    location_city TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    launch_date DATE,
    features JSONB DEFAULT '[]',
    slug TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. PROPERTIES (Imóveis)
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registered_by_id UUID REFERENCES public.profiles(id),
    development_id UUID REFERENCES public.developments(id),
    title TEXT NOT NULL,
    description TEXT,
    reference TEXT UNIQUE, -- Código URBS/Portal
    transaction_type TEXT DEFAULT 'sale', -- sale, rent, both
    property_category TEXT DEFAULT 'residential', -- residential, commercial
    type TEXT, -- Apartamento, Casa, etc.
    price NUMERIC,
    price_rent NUMERIC,
    price_iptu NUMERIC,
    price_condo NUMERIC,
    area_total NUMERIC,
    area_useful NUMERIC,
    rooms INT DEFAULT 0,
    suites INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    parking_spaces INT DEFAULT 0,
    status TEXT CHECK (status IN ('available', 'reserved', 'sold', 'rented')) DEFAULT 'available',
    pattern TEXT CHECK (pattern IN ('economic', 'medium', 'high_end')) DEFAULT 'medium',
    address_street TEXT,
    address_number TEXT,
    address_complement TEXT,
    address_neighborhood TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip_code TEXT,
    latitude TEXT,
    longitude TEXT,
    video_url TEXT,
    tour_360_url TEXT,
    is_highlight BOOLEAN DEFAULT false,
    metadata JSONB, -- For extra specs and features
    images TEXT[] DEFAULT '{}',
    main_image TEXT,
    slug TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. PROPERTY_OWNERS (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS public.property_owners (
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.owners(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, owner_id)
);

-- 7. LEADS (CRM)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assigned_to_id UUID REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    status TEXT CHECK (status IN ('lead', 'contact', 'presentation', 'visit', 'proposal', 'sale', 'lost')) DEFAULT 'lead',
    score INT DEFAULT 0, -- 0 to 100
    temperature TEXT CHECK (temperature IN ('cold', 'warm', 'hot')) DEFAULT 'cold',
    source TEXT, -- Indicação, Instagram, Portais, etc.
    history JSONB DEFAULT '[]', -- Log of interactions
    documents JSONB DEFAULT '[]', -- [{name, url, type, created_at}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. SALES (Vendas)
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id),
    property_id UUID REFERENCES public.properties(id),
    broker_id UUID REFERENCES public.profiles(id),
    total_price DECIMAL(12, 2) NOT NULL,
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. COMMISSIONS (Cálculo e Split)
CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE,
    total_commission_value DECIMAL(12, 2) NOT NULL,
    split_details JSONB NOT NULL, -- [{participant_id, role, value, percent}]
    status TEXT CHECK (status IN ('projected', 'received', 'paid')) DEFAULT 'projected',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. GOALS & PERFORMANCE (BI)
CREATE TABLE IF NOT EXISTS public.performance_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    month_year DATE NOT NULL, -- First day of the month
    vgv_achieved DECIMAL(15, 2) DEFAULT 0,
    leads_converted INT DEFAULT 0,
    visits_done INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. NOTIFICATIONS (Alertas em Realtime)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('lead', 'sale', 'task', 'system')) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. TASKS (Agenda)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('business', 'personal', 'meeting', 'visit', 'followup')) DEFAULT 'business',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS (Row Level Security) - Basic Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for now)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Leads are viewable by owner or manager." ON public.leads
FOR SELECT USING (
    auth.uid() = assigned_to_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own notifications." ON public.notifications
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications." ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);
