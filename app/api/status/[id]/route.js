import { NextResponse } from 'next/server';
import { extractVideoUrl, isValidRequestId } from '../../../../../lib/funny.mjs';

function getCredentials() {
  if (process.env.HF_CREDENTIALS) return process.env.HF_CREDENTIALS;
  if (process.env.HF_API_KEY && process.env.HF_API_SECRET) {
    return `${process.env.HF_API_KEY}:${process.env.HF_API_SECRET}`;
  }
  return null;
}

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!isValidRequestId(id)) {
    return NextResponse.json({ message: 'Identifiant de génération invalide.' }, { status: 400 });
  }

  const credentials = getCredentials();
  if (!credentials) {
    return NextResponse.json({ message: 'La clé Higgsfield n’est pas configurée.' }, { status: 503 });
  }

  try {
    const response = await fetch(`https://api.higgsfield.ai/requests/${id}/status`, {
      headers: { Authorization: `Key ${credentials}` },
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || data?.detail || `Impossible de lire le statut (${response.status}).` },
        { status: response.status }
      );
    }

    return NextResponse.json({
      requestId: id,
      status: data.status || 'queued',
      videoUrl: extractVideoUrl(data),
      message:
        data.status === 'completed'
          ? 'Ta vidéo est prête.'
          : data.status === 'failed'
            ? 'La génération a échoué.'
            : data.status === 'nsfw'
              ? 'La génération a été refusée par la modération.'
              : 'FUNNY est en train de créer ta vidéo…'
    });
  } catch (error) {
    console.error('FUNNY status error:', error);
    return NextResponse.json({ message: 'Impossible de vérifier la génération pour le moment.' }, { status: 500 });
  }
}
