import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, style } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ message: 'Le prompt est vide.' }, { status: 400 });
    }

    const hasHiggsfieldKey = Boolean(process.env.HF_KEY || (process.env.HF_API_KEY && process.env.HF_API_SECRET));

    if (!hasHiggsfieldKey) {
      return NextResponse.json({
        ready: true,
        connected: false,
        message: `FUNNY est prêt. Il reste à connecter Higgsfield pour générer la vidéo en style ${style || 'Cinématique'}.`
      });
    }

    return NextResponse.json({
      ready: true,
      connected: true,
      message: 'Higgsfield est configuré. La génération vidéo sera activée à l’étape suivante.'
    });
  } catch {
    return NextResponse.json({ message: 'Requête invalide.' }, { status: 400 });
  }
}
