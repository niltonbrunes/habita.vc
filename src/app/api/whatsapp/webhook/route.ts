import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI
const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build' });

const SYSTEM_PROMPT = `Você é a Ana Luiza, uma corretora de imóveis digital do Habita.vc.
Seu objetivo é ser amigável, qualificar o lead, apresentar o produto brevemente (se perguntarem), enviar o PDF de tabela quando apropriado e, principalmente, agendar uma visita presencial ou online ao stand do empreendimento.
Seja concisa, humana, e persuasiva. Use emojis com moderação. Nunca diga que é uma IA.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body || !body.data) {
       return NextResponse.json({ message: 'No data' }, { status: 200 });
    }

    const messageData = body.data;
    
    // Filter out status broadcasts, group messages, or messages sent by the bot itself
    if (messageData.key.fromMe || messageData.key.remoteJid.includes('@g.us') || messageData.key.remoteJid === 'status@broadcast') {
      return NextResponse.json({ message: 'Ignored' }, { status: 200 });
    }

    const phoneNumber = messageData.key.remoteJid.replace('@s.whatsapp.net', '');
    const messageText = messageData.message?.conversation || messageData.message?.extendedTextMessage?.text || '';

    if (!messageText) {
       return NextResponse.json({ message: 'No text content' }, { status: 200 });
    }

    // 1. Fetch or create chat history in Supabase
    let chatSession = null;
    let messagesHistory: any[] = [];
    
    const { data: existingChat, error: fetchError } = await supabase
      .from('whatsapp_chats')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();

    if (existingChat) {
      chatSession = existingChat;
      messagesHistory = existingChat.messages || [];
    } else {
      const { data: newChat, error: insertError } = await supabase
        .from('whatsapp_chats')
        .insert([{ phone_number: phoneNumber, messages: [] }])
        .select()
        .single();
        
      if (insertError) {
        console.error('Error creating chat session:', insertError);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
      chatSession = newChat;
    }

    // 2. Append new user message to history
    messagesHistory.push({ role: 'user', content: messageText });
    const recentHistory = messagesHistory.slice(-10);

    // 3. Call OpenAI
    const openAiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...recentHistory
    ];

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: openAiMessages as any[],
      temperature: 0.7,
    });

    const aiResponseText = completion.choices[0].message.content || 'Desculpe, não consegui entender.';

    // 4. Send response back via Evolution API
    const evolutionApiUrl = process.env.EVOLUTION_API_URL;
    const evolutionApiKey = process.env.EVOLUTION_API_KEY;
    const instanceName = process.env.EVOLUTION_INSTANCE_NAME || 'default';

    if (evolutionApiUrl && evolutionApiKey) {
      try {
        await fetch(`${evolutionApiUrl}/message/sendText/${instanceName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': evolutionApiKey
          },
          body: JSON.stringify({
            number: phoneNumber,
            options: {
              delay: 1500,
              presence: 'composing'
            },
            textMessage: {
              text: aiResponseText
            }
          })
        });
      } catch (err) {
        console.error('Error sending message via Evolution API', err);
      }
    }

    // 5. Save AI response to history
    messagesHistory.push({ role: 'assistant', content: aiResponseText });
    
    await supabase
      .from('whatsapp_chats')
      .update({ messages: messagesHistory, updated_at: new Date().toISOString() })
      .eq('id', chatSession.id);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

