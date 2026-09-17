'use client';

import { useState } from 'react';

const styles = ['Cinématique', 'Drôle', 'Publicité', 'Clip', 'Thriller'];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinématique');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  async function pollGeneration(requestId) {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      await wait(3000);

      const res = await fetch(`/api/status/${requestId}`, { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Impossible de vérifier la génération.');
      }

      setStatus(data.message || 'FUNNY est en train de créer ta vidéo…');

      if (data.status === 'completed' && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        return;
      }

      if (data.status === 'failed' || data.status === 'nsfw') {
        throw new Error(data.message || 'La génération n’a pas pu aboutir.');
      }
    }

    throw new Error('La génération prend plus de temps que prévu. Réessaie dans quelques instants.');
  }

  async function handleGenerate() {
    if (!prompt.trim()) {
      setStatus('Décris d’abord ton idée de vidéo.');
      return;
    }

    setLoading(true);
    setVideoUrl('');
    setStatus('Envoi de ton idée à Higgsfield…');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Impossible de lancer la génération.');
      }

      setStatus(data.message || 'Génération lancée.');

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        return;
      }

      if (!data.requestId) {
        throw new Error('Higgsfield n’a pas renvoyé d’identifiant de génération.');
      }

      await pollGeneration(data.requestId);
    } catch (error) {
      setStatus(error.message || 'Impossible de joindre le serveur pour le moment.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="badge">AI VIDEO DIRECTOR</div>
        <h1>FUNNY</h1>
        <p className="tagline">Transforme une idée en vidéo prête à poster.</p>

        <div className="creator-card">
          <label htmlFor="prompt">Décris ta vidéo</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex. Une fausse pub ultra sérieuse pour un kebab qui sauve le monde…"
            rows={6}
          />

          <div className="style-row" aria-label="Choisir un style">
            {styles.map((item) => (
              <button
                key={item}
                type="button"
                className={style === item ? 'style active' : 'style'}
                onClick={() => setStyle(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <button className="generate" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Création en cours…' : 'Générer ma vidéo'}
          </button>

          {status && <p className="status">{status}</p>}

          {videoUrl && (
            <div className="result-card">
              <span>TA VIDÉO FUNNY</span>
              <video src={videoUrl} controls playsInline preload="metadata" />
              <a href={videoUrl} target="_blank" rel="noreferrer">Ouvrir la vidéo</a>
            </div>
          )}
        </div>

        <div className="steps">
          <div><span>01</span><strong>Une idée</strong><p>Écris simplement ce que tu veux voir.</p></div>
          <div><span>02</span><strong>FUNNY réalise</strong><p>Ton prompt est envoyé à Higgsfield et généré en vidéo verticale.</p></div>
          <div><span>03</span><strong>Prêt à poster</strong><p>Format 9:16 pensé pour TikTok, Reels et Shorts.</p></div>
        </div>
      </section>
    </main>
  );
}
