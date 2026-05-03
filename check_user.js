const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kwnelwicqlogwjseohlt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bmVsd2ljcWxvZ3dqc2VvaGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTU2NzcsImV4cCI6MjA5MzM3MTY3N30.n-b2A8ohZ2mv-D2m25-pqsEL409JhZyM6b8t9vkeWKU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUser() {
    console.log('Buscando Nilton no banco...');
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('email', 'niltonbrunes@gmail.com')
        .maybeSingle();

    if (error) {
        console.log('❌ Erro:', error.message);
    } else if (!data) {
        console.log('⚠️ Perfil não encontrado.');
    } else {
        console.log('✅ Perfil encontrado:', data);
    }
}

checkUser();
