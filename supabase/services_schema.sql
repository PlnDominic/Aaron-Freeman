-- Services table schema
-- This table stores the services offered in the portfolio

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'MapPin',
    features TEXT[] DEFAULT '{}',
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_order_index ON services(order_index);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Enable Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and authenticated write access
CREATE POLICY "Services are viewable by everyone" ON services
    FOR SELECT USING (true);

CREATE POLICY "Services are editable by authenticated users" ON services
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default services data
INSERT INTO services (title, description, icon, features, category, is_active, order_index) VALUES
(
    'Basic Mapping & Spatial Visualisation',
    'Creating clear, purpose-driven maps to support development applications, resilience strategies, and community presentations. Includes land use overlays, access route mapping, and annotated planning visuals.',
    'MapPin',
    ARRAY['Land use overlays', 'Access route mapping', 'Annotated planning visuals', 'Development application support', 'Community presentations'],
    'Technical',
    true,
    1
),
(
    'Planning Documentation & Report Writing',
    'Drafting concise, structured planning documents such as development application support reports, responses to information requests (RFIs), stakeholder summaries, and site evaluations.',
    'FileText',
    ARRAY['Development application reports', 'RFI responses', 'Stakeholder summaries', 'Site evaluations', 'Structured documentation'],
    'Documentation',
    true,
    2
),
(
    'Planning Research & Policy Support',
    'Providing desktop research, policy summaries, and local planning scheme analysis to support planning proposals and strategy development. Suitable for both public and private sector projects.',
    'Search',
    ARRAY['Desktop research', 'Policy summaries', 'Planning scheme analysis', 'Strategy development', 'Public & private sector support'],
    'Research',
    true,
    3
),
(
    'Community Engagement & Multicultural Planning Support',
    'Assisting with inclusive engagement strategies that reflect diverse community voices and lived experience. Ideal for public participation processes, workshops, and culturally sensitive planning projects.',
    'Users',
    ARRAY['Inclusive engagement strategies', 'Community voice integration', 'Public participation', 'Workshop facilitation', 'Cultural sensitivity'],
    'Community',
    true,
    4
),
(
    'Strategic Planning Thinking & Resilience Integration',
    'Contributing to early-stage strategic frameworks with insight into infrastructure resilience, equity, emergency access, and megatrend responsiveness — informed by academic work and disaster case studies.',
    'Lightbulb',
    ARRAY['Strategic frameworks', 'Infrastructure resilience', 'Equity integration', 'Emergency access planning', 'Megatrend analysis'],
    'Strategy',
    true,
    5
),
(
    'Writing for Planning Communication',
    'Translating complex planning ideas into plain English for public-facing reports, educational blog posts, or community content. Great for local government teams, advocacy groups, or planning consultancies wanting accessible communications.',
    'PenTool',
    ARRAY['Plain English translation', 'Public-facing reports', 'Educational content', 'Community communications', 'Accessible language'],
    'Communication',
    true,
    6
),
(
    'Workshop & Presentation Support',
    'Assisting with the design and facilitation of planning-related workshops, including participatory design, community co-creation, or student outreach — especially in multicultural contexts.',
    'Presentation',
    ARRAY['Workshop design', 'Facilitation support', 'Participatory design', 'Community co-creation', 'Student outreach'],
    'Facilitation',
    true,
    7
)
ON CONFLICT (id) DO NOTHING;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON services 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comment on the table
COMMENT ON TABLE services IS 'Stores the professional services offered in the portfolio';
COMMENT ON COLUMN services.title IS 'The title/name of the service';
COMMENT ON COLUMN services.description IS 'Detailed description of the service offering';
COMMENT ON COLUMN services.icon IS 'Icon name from the available icon set';
COMMENT ON COLUMN services.features IS 'Array of key features for this service';
COMMENT ON COLUMN services.category IS 'Service category for grouping and filtering';
COMMENT ON COLUMN services.is_active IS 'Whether the service is currently active/visible';
COMMENT ON COLUMN services.order_index IS 'Display order of the service (lower numbers first)'; 