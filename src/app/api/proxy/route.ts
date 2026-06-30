export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get('url');

  if (!url) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'HabitaVC-Proxy/1.0' },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Proxy target responded with HTTP ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('Content-Type') || 'application/xml',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
