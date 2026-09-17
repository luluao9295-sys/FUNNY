import './globals.css';

export const metadata = {
  title: 'FUNNY — AI Video Director',
  description: 'Transforme une idée en vidéo prête à poster.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
