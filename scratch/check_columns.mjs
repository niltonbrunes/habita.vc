import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {} as any);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // Get property_owners columns by querying one row or doing an empty query
  const { data, error } = await supabase.from('property_owners').select('*').limit(1);
  if (error) {
    console.error('Error fetching property_owners:', error);
  } else {
    console.log('Columns in property_owners:', data.length > 0 ? Object.keys(data[0]) : 'No rows. Fetching from openapi schema might be needed.');
  }

  // To get columns even if empty, we can query an invalid id to get an empty array but with columns? No, Supabase JS just returns []
  // Alternatively, try inserting a dummy row with only name and see what comes back, or use REST API directly to get schema.
}

check();
