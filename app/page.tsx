"use client";

import Link from "next/link";

export default function Home() {
  const tiles = [
    {
      title: "Dashboard",
      desc: "Übersicht über HU‑Termine und Statistiken",
      href: "/dashboard",
      icon: "📊",
    },
    {
      title: "Kunden",
      desc: "Kunden verwalten und bearbeiten",
      href: "/kunden",
      icon: "👤",
    },
    {
      title: "Fahrzeuge",
      desc: "Fahrzeuge anzeigen und verwalten",
      href: "/fahrzeuge",
      icon: "🚗",
    },
    {
      title: "Reparaturen",
      desc: "Reparaturen und Positionen verwalten",
      href: "/reparaturen/1", // Dummy, wird ignoriert — Liste ist fahrzeugbezogen
      icon: "🛠️",
    },
    {
      title: "Artikel",
      desc: "Artikel und Preise verwalten",
      href: "/artikel",
      icon: "📦",
    },
    {
      title: "Einstellungen",
      desc: "Marken, Modelle, Anreden",
      href: "/einstellungen",
      icon: "⚙️",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold underline mb-8">
        Werkstattmanager – Startseite
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map((t) => (
          <Link
            key={t.title}
            href={t.href}
            className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-gray-50"
          >
            <div className="text-4xl mb-3">{t.icon}</div>
            <h2 className="text-xl font-bold mb-1">{t.title}</h2>
            <p className="text-gray-600">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
