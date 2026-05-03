const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhktwlcrcbiqrtmtyxwg.supabase.co';
const supabaseAnonKey = 'sb_publishable_GW6EfcHuEKdG24WyzES1cQ_Zzzfn0C3';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
    const userEmail = 'niltonbrunes@gmail.com';
    console.log(`🚀 Iniciando setup para ${userEmail}...`);

    // 1. Pegar o ID do usuário no Auth
    // Nota: Anon key não pode listar usuários, mas o Nilton já está logado. 
    // Vou usar o ID que o sistema gerou ou buscar pelo email (se permitido).
    // Como teste, vamos tentar inserir o perfil usando o email como chave se o ID falhar.
    
    // Na verdade, no Supabase, o ID do auth.users é o mesmo do public.profiles.
    // Vou tentar um truque: se eu não tenho o ID, vou pedir para o usuário logar e me dar o ID? 
    // Não, vou tentar buscar um lead existente para ver o ID ou profiles.
    
    const { data: userData, error: userError } = await supabase.from('profiles').select('id').eq('email', userEmail).maybeSingle();
    
    let userId = userData?.id;

    if (!userId) {
        console.log('⚠️ Perfil não encontrado. Tentando criar perfil via RPC ou Insert...');
        // Como a anon key tem RLS, o insert pode falhar se não houver política de INSERT para anon (o que não deve ter).
        // Mas o usuário Nilton já deve ter um ID se ele se cadastrou.
        console.log('❌ Não consegui detectar seu ID automaticamente. Por favor, rode o comando SQL no painel do Supabase que passei anteriormente para criar seu perfil.');
        return;
    }

    console.log(`✅ ID do usuário detectado: ${userId}`);

    // 2. Inserir Leads de Teste
    console.log('📦 Inserindo leads de teste...');
    const { error: leadError } = await supabase.from('leads').insert([
        { name: 'Ricardo Santos (Teste)', email: 'ricardo@teste.com', phone: '62999991111', status: 'lead', score: 85, temperature: 'hot', assigned_to_id: userId },
        { name: 'Amanda Lima (Teste)', email: 'amanda@teste.com', phone: '62999992222', status: 'contact', score: 45, temperature: 'warm', assigned_to_id: userId },
        { name: 'Bruno Mendes (Teste)', email: 'bruno@teste.com', phone: '62999993333', status: 'visit', score: 92, temperature: 'hot', assigned_to_id: userId }
    ]);

    if (leadError) console.log(`❌ Erro leads: ${leadError.message}`);
    else console.log('✅ Leads inseridos com sucesso!');

    // 3. Inserir Tarefas
    console.log('📅 Inserindo tarefas...');
    const { error: taskError } = await supabase.from('tasks').insert([
        { title: 'Ligar para Ricardo Santos', category: 'business', priority: 'high', due_date: new Date().toISOString(), user_id: userId },
        { title: 'Preparar contrato Leblon', category: 'business', priority: 'medium', due_date: new Date().toISOString(), user_id: userId }
    ]);

    if (taskError) console.log(`❌ Erro tarefas: ${taskError.message}`);
    else console.log('✅ Tarefas inseridas com sucesso!');

    console.log('\n✨ Setup finalizado! Agora atualize seu navegador (F5).');
}

seed();
