'use client';

import { useState } from 'react';

const styles = ['Cinématique', 'Drôle', 'Publicité', 'Clip', 'Thriller'];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinématique');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) {
      setStatus('Décris d’abord ton idée de vidéo.');
      return;
    }

    setLoading(true);
    setStatus('Préparation de ton projet…');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style })
      });

      const data = await res.json();
      setStatus(data.message || 'Projet prêt.');
    } catch {
      setStatus('Impossible de joindre le serveur pour le moment.');
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
            {loading ? 'Création…' : 'Générer ma vidéo'}
          </button>

          {status && <p className="status">{status}</p>}
        </div>

        <div className="steps">
          <div><span>01</span><strong>Une idée</strong><p>Écris simplement ce que tu veux voir.</p></div>
          <div><span>02</span><strong>FUNNY réalise</strong><p>Découpage, style et génération des scènes.</p></div>
          <div><span>03</span><strong>Prêt à poster</strong><p>Format vertical pensé pour TikTok, Reels et Shorts.</p></div>
        </div>
      </section>
    </main>
  );
}
