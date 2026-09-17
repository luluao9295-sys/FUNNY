import { NextResponse } from 'next/server';
import { buildGenerationInput, extractVideoUrl } from '../../../lib/funny.mjs';

function getCredentials() {
  if (process.env.HF_CREDENTIALS) return process.env.HF_CREDENTIALS;
  if (process.env.HF_API_KEY && process.env.HF_API_SECRET) {
    return `${process.env.HF_API_KEY}:${process.env.HF_API_SECRET}`;
  }
  return null;
}

export async function POST(request) {
  try {
    const { prompt, style } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ message: 'Le prompt est vide.' }, { status: 400 });
    }

    const credentials = getCredentials();
    if (!credentials) {
      return NextResponse.json(
        { message: 'La clé Higgsfield n’est pas encore configurée dans Vercel.' },
        { status: 503 }
      );
    }

    const { endpoint, input } = buildGenerationInput(prompt, style);
    const response = await fetch(`https://api.higgsfield.ai/${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input),
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || data?.detail || `Higgsfield a refusé la requête (${response.status}).` },
        { status: response.status }
      );
    }

    const requestId = data.request_id || data.id;
    const videoUrl = extractVideoUrl(data);

    if (!requestId && !videoUrl) {
      return NextResponse.json(
        { message: 'Higgsfield a accepté la requête mais n’a pas renvoyé d’identifiant exploitable.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      requestId: requestId || null,
      status: data.status || (videoUrl ? 'completed' : 'queued'),
      videoUrl,
      message: videoUrl ? 'Ta vidéo est prête.' : 'Génération lancée avec Higgsfield.'
    });
  } catch (error) {
    console.error('FUNNY generate error:', error);
    return NextResponse.json({ message: 'Impossible de lancer la génération pour le moment.' }, { status: 500 });
  }
}
