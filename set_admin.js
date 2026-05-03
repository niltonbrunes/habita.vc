const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhktwlcrcbiqrtmtyxwg.supabase.co';
const supabaseAnonKey = 'sb_publishable_GW6EfcHuEKdG24WyzES1cQ_Zzzfn0C3';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setAdmin() {
    console.log('Verificando perfil do Nilton...');
    const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', 'niltonbrunes@gmail.com')
        .select();

    if (error) {
        console.log('❌ Erro ao atualizar role:', error.message);
    } else if (data.length === 0) {
        console.log('⚠️ Perfil não encontrado para atualizar. Criando perfil como admin...');
        // Tentativa de insert se não existir
        // Note: Isso depende do ID do Auth. Vou tentar pegar do profiles ou pular.
        console.log('Por favor, certifique-se de que rodou o script de Seed que passei antes no SQL Editor.');
    } else {
        console.log('✅ Nilton agora é Admin oficial no banco!');
    }
}

setAdmin();
