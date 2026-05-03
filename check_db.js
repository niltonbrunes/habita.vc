const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhktwlcrcbiqrtmtyxwg.supabase.co';
const supabaseAnonKey = 'sb_publishable_GW6EfcHuEKdG24WyzES1cQ_Zzzfn0C3';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
    const tables = ['profiles', 'properties', 'leads', 'tasks'];
    console.log('Testando leitura de dados (anon)...');
    
    for (const table of tables) {
        const { data, error, status } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`❌ Tabela '${table}': Erro ${error.code} (${error.message}) - Status: ${status}`);
        } else {
            console.log(`✅ Tabela '${table}': Acessível. Linhas encontradas: ${data.length}`);
        }
    }
}

testFetch();
