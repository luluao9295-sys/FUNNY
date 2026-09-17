const STYLE_DIRECTIONS = {
  'Cinématique': 'cinematic, premium lighting, controlled camera movement, realistic motion, polished composition',
  'Drôle': 'comédie visuelle, timing comique clair, situation absurde mais crédible, énergie virale',
  'Publicité': 'publicité premium, produit ou sujet immédiatement lisible, rythme efficace, image très propre',
  'Clip': 'music video, stylish performance energy, dynamic camera, bold lighting, rhythmic visual pacing',
  'Thriller': 'thriller cinématographique, tension progressive, contraste dramatique, caméra immersive'
};

export function buildGenerationInput(prompt, style = 'Cinématique') {
  const cleanPrompt = String(prompt || '').trim();
  const direction = STYLE_DIRECTIONS[style] || STYLE_DIRECTIONS['Cinématique'];

  return {
    endpoint: 'bytedance/seedance-2.5/text-to-video',
    input: {
      prompt: `${cleanPrompt}. Direction: ${direction}. Vertical social video, strong first-second hook, no on-screen text unless explicitly requested.`,
      duration: 5,
      resolution: '720p',
      aspect_ratio: '9:16',
      output_format: 'mp4',
      generate_audio: true
    }
  };
}

export function extractVideoUrl(payload) {
  return payload?.video?.url || payload?.jobs?.[0]?.results?.raw?.url || null;
}

export function isValidRequestId(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}
