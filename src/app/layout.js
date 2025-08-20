"use client"; // ✅ Important: this makes the layout a client component

import './globals.css';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css/animate.min.css';
import { AuthProvider } from './context/AuthContext'; // correct relative path

export const metadata = {
  title: 'ValidAuto',
  description: 'Centre de service automobile qualifié',
  keywords: 'automobile, service, contrôle technique, voiture, ValidAuto',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@600;700&family=Ubuntu:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />
        <link rel="icon" href="/img/favicon.ico" />
      </head>
      <body>
        {/* 👇 AuthProvider wraps the entire app */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
