import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { inserts, updates, suspends } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const results = { inserted: 0, updated: 0, suspended: 0, errors: [] as any[] };

    // 1. Bulk Insert
    if (inserts && inserts.length > 0) {
      const { error } = await supabase.from('properties').insert(inserts);
      if (error) {
        results.errors.push({ type: 'insert', error: error.message });
      } else {
        results.inserted = inserts.length;
      }
    }

    // 2. Batch Updates (Run in parallel for speed)
    if (updates && updates.length > 0) {
      await Promise.all(
        updates.map(async (u: { id: string; fields: any }) => {
          const { error } = await supabase
            .from('properties')
            .update(u.fields)
            .eq('id', u.id);
          if (error) {
            results.errors.push({ type: 'update', id: u.id, error: error.message });
          } else {
            results.updated++;
          }
        })
      );
    }

    // 3. Bulk Suspend
    if (suspends && suspends.length > 0) {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'suspended' })
        .in('id', suspends);
      
      if (error) {
        results.errors.push({ type: 'suspend', error: error.message });
      } else {
        results.suspended = suspends.length;
      }
    }

    if (results.errors.length > 0) {
      console.error('Batch errors:', results.errors);
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error in batch API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
