import type { Metadata } from "next";
import "./globals.css"; // Assurez-vous que ce fichier existe pour Tailwind

export const metadata: Metadata = {
  title: "Gestion Clinique - Lallène Cédric ACHI",
  description: "Système de gestion de consultations et pharmacie",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}